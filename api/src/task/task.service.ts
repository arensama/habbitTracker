import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './entities/task.entity';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { JwtPayloadDto } from 'src/auth/dto/req.interface';
import * as dayjs from 'dayjs';
import { weekDays } from 'src/assets/weekDays';
import { Tracker } from 'src/tracker/entities/tracker.entity';
import { TrackerService } from 'src/tracker/tracker.service';

@Injectable()
export class TaskService {
  constructor(
    private trackerService: TrackerService,
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Tracker.name) private trackerModel: Model<Tracker>,
  ) {}

  async create(
    user: JwtPayloadDto,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const { schedule, endDate, startDate, ...rest } = createTaskDto;

    const task = new this.taskModel({
      schedule,
      endDate,
      startDate,
      ...rest,
      owner: user.sub,
    });
    await task.save();
    const trackerArray = [];
    for (
      let i = dayjs(startDate).startOf('day').add(10, 'minutes');
      i.isBefore(endDate);
      i = i.add(1, 'day')
    ) {
      const DayOfTheWeek = i.format('ddd');
      const DayOfTheWeekIndex = weekDays.find(
        (i) => i.title == DayOfTheWeek,
      ).id;
      if (schedule.findIndex((j) => j == DayOfTheWeekIndex) > -1)
        trackerArray.push({
          start: dayjs(i).toDate(),
          end: dayjs(i).add(3, 'seconds').toDate(),
          isActive: false,
          duration: 0,
          owner: user.sub,
          task: task._id,
        });
    }
    const trackers = await this.trackerModel.insertMany(trackerArray);
    await this.taskModel.updateOne(
      { _id: task._id },
      { $set: { history: trackers.map((i) => i._id) } },
    );
    return task;
  }

  async findAll(user: JwtPayloadDto) {
    const userId = new mongoose.Types.ObjectId(user.sub);
    const tasks = await this.taskModel.aggregate([
      { $match: { owner: userId } }, // Match tasks with specified IDs
      {
        $lookup: {
          from: 'trackers', // Assuming the name of the Tracker collection
          localField: 'history',
          foreignField: '_id',
          as: 'history',
        },
      },
    ]);
    return tasks;
  }

  async getStreaks(user: JwtPayloadDto, taskId?: string): Promise<any> {
    const userId = new mongoose.Types.ObjectId(user.sub);
    const todayDateStart = dayjs().startOf('day').toDate();

    const streaks = await this.taskModel.aggregate([
      {
        $match: {
          owner: userId,
          ...(taskId ? { _id: new mongoose.Types.ObjectId(taskId) } : {}),
        },
      }, // Match tasks with specified IDs
      {
        $lookup: {
          from: 'trackers', // Assuming the name of the Tracker collection
          let: { taskId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$task', '$$taskId'] },
                    { $lte: ['$start', todayDateStart] },
                    // { $gte: ['$start', todayDateStart] },
                  ],
                },
              },
            },
          ],
          as: 'history',
        },
      },
      {
        $unwind: '$history',
      },

      {
        $group: {
          _id: {
            taskId: '$_id',
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$history.start' },
            },
          },
          task: { $first: '$$ROOT' },
          dailyDuration: { $sum: '$history.duration' },
        },
      },
      {
        $group: {
          _id: '$_id.taskId',
          task: { $first: '$task' },
          streaks: {
            $push: {
              date: '$_id.date',
              dailyDuration: '$dailyDuration',
              isStreak: {
                $gte: [
                  '$dailyDuration',
                  { $multiply: ['$task.duration', '$task.timesPerDay'] },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          task: 1,
          streaks: 1,
          totalDuration: { $sum: '$streaks.dailyDuration' },
        },
      },
      {
        $unwind: '$streaks', // Unwind the streaks array
      },
      {
        $sort: { 'streaks.date': 1 }, // Sort by date in ascending order
      },
      {
        $group: {
          _id: '$_id',
          task: { $first: '$task' },
          streaks: { $push: '$streaks' },
        },
      },
      {
        $project: {
          _id: 1,
          task: 1,
          streaks: 1,
          longestConsecutiveStreak: {
            $reduce: {
              input: '$streaks',
              initialValue: {
                currentStreak: 0,
                longestStreak: 0,
              },
              in: {
                currentStreak: {
                  $cond: [
                    { $eq: ['$$this.isStreak', true] },
                    { $add: ['$$value.currentStreak', 1] },
                    0,
                  ],
                },
                longestStreak: {
                  $max: ['$$value.longestStreak', '$$value.currentStreak'],
                },
              },
            },
          },
          test: {
            $reduce: {
              input: '$streaks',
              initialValue: '',
              in: {
                $concat: [
                  '$$value',

                  {
                    $cond: [
                      {
                        $eq: ['$$this.isStreak', true],
                      },
                      '1',
                      '0',
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          maxCurrentStreak: { $max: '$longestConsecutiveStreak.currentStreak' },
          maxLongestStreak: { $max: '$longestConsecutiveStreak.longestStreak' },
        },
      },
      {
        $project: {
          _id: 0,
          maxCurrentStreak: 1,
          maxLongestStreak: 1,
        },
      },
    ]);
    return {
      maxCurrentStreak: streaks?.[0]?.maxCurrentStreak,
      maxLongestStreak: Math.max(
        streaks?.[0]?.maxLongestStreak,
        streaks?.[0]?.maxCurrentStreak,
      ),
    };
    return streaks;
  }

  async summery(user: JwtPayloadDto) {
    const streaks = await this.getStreaks(user);
    const userId = new mongoose.Types.ObjectId(user.sub);
    const todayDateStart = dayjs().startOf('day').toDate();
    const todayDateEnd = dayjs().endOf('day').toDate();
    const todayDayOfTheWeek = dayjs().format('ddd');
    const todayDayOfTheWeekIndex = weekDays.find(
      (i) => i.title == todayDayOfTheWeek,
    ).id;
    const tasks = await this.taskModel.aggregate([
      {
        $match: {
          owner: userId,
          startDate: { $lte: todayDateEnd },
          endDate: { $gte: todayDateStart },
          schedule: todayDayOfTheWeekIndex,
        },
      },
      {
        $lookup: {
          from: 'trackers', // Assuming the name of the Tracker collection
          let: { taskId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$task', '$$taskId'] },
                    { $lte: ['$start', todayDateEnd] },
                    { $gte: ['$start', todayDateStart] },
                  ],
                },
              },
            },
          ],
          as: 'history',
        },
      },

      {
        $addFields: {
          totalDuration: { $sum: '$history.duration' },
          totalDurationPerDay: {
            $multiply: ['$duration', '$timesPerDay'],
          },
        },
      },
      {
        $addFields: {
          percent: {
            $toInt: {
              $multiply: [
                { $divide: ['$totalDuration', '$totalDurationPerDay'] },
                100,
              ],
            },
          },
        },
      },
    ]);
    return {
      tasks,
      streaks: streaks,
    };
  }

  async findOne(user: JwtPayloadDto, _id: string) {
    const userId = new mongoose.Types.ObjectId(user.sub);
    const todayDateStart = dayjs().startOf('day').toDate();
    const todayDateEnd = dayjs().endOf('day').toDate();
    const todayDayOfTheWeek = dayjs().format('ddd');
    const todayDayOfTheWeekIndex = weekDays.find(
      (i) => i.title == todayDayOfTheWeek,
    ).id;
    const tasks = await this.taskModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(_id),
          owner: userId,
        },
      },

      {
        $lookup: {
          from: 'trackers', // Assuming the name of the Tracker collection
          let: { taskId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$task', '$$taskId'] },
                    { $lte: ['$start', todayDateEnd] },
                    { $gte: ['$start', todayDateStart] },
                  ],
                },
              },
            },
          ],
          as: 'history',
        },
      },

      {
        $addFields: {
          totalDuration: { $sum: '$history.duration' },
          totalDurationPerDay: {
            $multiply: ['$duration', '$timesPerDay'],
          },
        },
      },
      {
        $addFields: {
          percent: {
            $toInt: {
              $multiply: [
                { $divide: ['$totalDuration', '$totalDurationPerDay'] },
                100,
              ],
            },
          },
        },
      },
    ]);
    const task = tasks?.[0];
    const tracker = await this.trackerService.task(user, task?._id);
    const streaks = await this.getStreaks(user, _id);
    return { ...task, tracker, streaks };
  }

  update(user: JwtPayloadDto, _id: string, updateTaskDto: UpdateTaskDto) {
    const { ...rest } = updateTaskDto;

    const task = new this.taskModel({ ...rest });
    return task.save();
  }

  remove(user: JwtPayloadDto, _id: string) {
    return this.taskModel.deleteOne({ owner: user.sub, _id }).exec();
  }
  async mock(user: JwtPayloadDto) {
    // const getRandomDate = (): Date => {
    //   const randomDays = Math.floor(Math.random() * 30); // Random days between 0 and 29
    //   return dayjs().subtract(randomDays, 'days').toDate();
    // };

    // const generateMockTask = (index: number): Task => {
    //   return {
    //     icon: (index % 3) + 1,
    //     color: ((index + 1) % 4) + 1,
    //     timesPerDay: ((index + 2) % 5) + 1,
    //     hasDuration: index % 2 === 0,
    //     duration: (index + 3) % 60,
    //     title: `Mock Task ${index + 1}`,
    //     schedule: [1, 2, 3],
    //     startDate: getRandomDate(),
    //     endDate: getRandomDate(),
    //     //@ts-ignore
    //     owner: '65995fa9e10788256504aafd',
    //     history: [],
    //   };
    // };

    // const generateMockTracker = (index: number): Tracker => {
    //   return {
    //     start: getRandomDate(),
    //     end: getRandomDate(),
    //     isActive: false,
    //     duration: (index + 1) % 40,
    //     address: `task with id ${index + 1}`,
    //     //@ts-ignore
    //     owner: '65995fa9e10788256504aafd',
    //     // task: new mongoose.Types.ObjectId(),
    //   };
    // };

    // const generateMockData = async (numMocks: number) => {
    //   for (let i = 0; i < numMocks; i++) {
    //     const mockTask = generateMockTask(i);
    //     const mockTracker = generateMockTracker(i);
    //     const mockTracker2 = generateMockTracker(i);
    //     const mockTracker3 = generateMockTracker(i);
    //     //@ts-ignore
    //     const task = await this.taskModel({ ...mockTask });
    //     await task.save();
    //     console.log('task', task._id);
    //     const tracker1 = await this.trackerService.create(user, {
    //       ...mockTracker,
    //       task: task?._id,
    //     });

    //     const tracker2 = await this.trackerService.create(user, {
    //       ...mockTracker2,
    //       task: task?._id,
    //     });
    //     const tracker3 = await this.trackerService.create(user, {
    //       ...mockTracker3,
    //       task: task?._id,
    //     });
    //     await this.taskModel.updateOne(
    //       { _id: task._id },
    //       { $set: { history: [tracker1._id, tracker2._id, tracker3._id] } },
    //     );
    //   }
    // };
    // const numberOfMocks = 5;
    // generateMockData(numberOfMocks);
    const userId = new mongoose.Types.ObjectId('65995fa9e10788256504aafd');
    const task = await this.create(user, {
      icon: 1,
      color: 1,
      timesPerDay: 2,
      hasDuration: true,
      duration: 30,
      title: `Mock Task new`,
      schedule: [1, 2, 3],
      startDate: dayjs().add(-1, 'week').toDate(),
      endDate: dayjs().add(1, 'week').toDate(),
      repeatable: false,
      currentStreak: 0,
      longestStreak: 0,
    });
    const trackers = await this.trackerModel.insertMany([
      // {
      //   start: dayjs().toDate(),
      //   end: dayjs().add(30, 'seconds').toDate(),
      //   isActive: false,
      //   duration: 30,
      //   address: `task with id 659a7f8ff6c2ca8247116a7c`,
      //   owner: userId,
      //   task: task._id,
      // },
      // {
      //   start: dayjs().toDate(),
      //   end: dayjs().add(30, 'seconds').toDate(),
      //   isActive: false,
      //   duration: 30,
      //   address: `task with id 659a7f8ff6c2ca8247116a7c`,
      //   owner: userId,
      //   task: task._id,
      // },
      // {
      //   start: dayjs().toDate(),
      //   end: dayjs().add(30, 'seconds').toDate(),
      //   isActive: false,
      //   duration: 30,
      //   address: `task with id 659a7f8ff6c2ca8247116a7c`,
      //   owner: userId,
      //   task: task._id,
      // },
      // {
      //   start: dayjs().toDate(),
      //   end: dayjs().add(30, 'seconds').toDate(),
      //   isActive: false,
      //   duration: 30,
      //   address: `task with id 659a7f8ff6c2ca8247116a7c`,
      //   owner: userId,
      //   task: task._id,
      // },
      {
        start: dayjs().add(-1, 'days').toDate(),
        end: dayjs().add(30, 'seconds').toDate(),
        isActive: false,
        duration: 30,
        address: `task with id 659a7f8ff6c2ca8247116a7c`,
        owner: userId,
        task: task._id,
      },
      {
        start: dayjs().add(-1, 'days').toDate(),
        end: dayjs().add(30, 'seconds').toDate(),
        isActive: false,
        duration: 30,
        address: `task with id 659a7f8ff6c2ca8247116a7c`,
        owner: userId,
        task: task._id,
      },
      {
        start: dayjs().add(-1, 'days').toDate(),
        end: dayjs().add(30, 'seconds').toDate(),
        isActive: false,
        duration: 30,
        address: `task with id 659a7f8ff6c2ca8247116a7c`,
        owner: userId,
        task: task._id,
      },
      {
        start: dayjs().add(-2, 'days').toDate(),
        end: dayjs().add(30, 'seconds').toDate(),
        isActive: false,
        duration: 30,
        address: `task with id 659a7f8ff6c2ca8247116a7c`,
        owner: userId,
        task: task._id,
      },
      {
        start: dayjs().add(-2, 'days').toDate(),
        end: dayjs().add(30, 'seconds').toDate(),
        isActive: false,
        duration: 30,
        address: `task with id 659a7f8ff6c2ca8247116a7c`,
        owner: userId,
        task: task._id,
      },
      {
        start: dayjs().add(-3, 'days').toDate(),
        end: dayjs().add(30, 'seconds').toDate(),
        isActive: false,
        duration: 30,
        address: `task with id 659a7f8ff6c2ca8247116a7c`,
        owner: userId,
        task: task._id,
      },
      {
        start: dayjs().add(-3, 'days').toDate(),
        end: dayjs().add(30, 'seconds').toDate(),
        isActive: false,
        duration: 30,
        address: `task with id 659a7f8ff6c2ca8247116a7c`,
        owner: userId,
        task: task._id,
      },
      {
        start: dayjs().add(-4, 'days').toDate(),
        end: dayjs().add(30, 'seconds').toDate(),
        isActive: false,
        duration: 30,
        address: `task with id 659a7f8ff6c2ca8247116a7c`,
        owner: userId,
        task: task._id,
      },
      {
        start: dayjs().add(-4, 'days').toDate(),
        end: dayjs().add(30, 'seconds').toDate(),
        isActive: false,
        duration: 30,
        address: `task with id 659a7f8ff6c2ca8247116a7c`,
        owner: userId,
        task: task._id,
      },
      {
        start: dayjs().add(-5, 'days').toDate(),
        end: dayjs().add(30, 'seconds').toDate(),
        isActive: false,
        duration: 30,
        address: `task with id 659a7f8ff6c2ca8247116a7c`,
        owner: userId,
        task: task._id,
      },
      {
        start: dayjs().add(-5, 'days').toDate(),
        end: dayjs().add(30, 'seconds').toDate(),
        isActive: false,
        duration: 30,
        address: `task with id 659a7f8ff6c2ca8247116a7c`,
        owner: userId,
        task: task._id,
      },
      {
        start: dayjs().add(-6, 'days').toDate(),
        end: dayjs().add(30, 'seconds').toDate(),
        isActive: false,
        duration: 30,
        address: `task with id 659a7f8ff6c2ca8247116a7c`,
        owner: userId,
        task: task._id,
      },
      {
        start: dayjs().add(-6, 'days').toDate(),
        end: dayjs().add(30, 'seconds').toDate(),
        isActive: false,
        duration: 30,
        address: `task with id 659a7f8ff6c2ca8247116a7c`,
        owner: userId,
        task: task._id,
      },
      {
        start: dayjs().add(-8, 'days').toDate(),
        end: dayjs().add(30, 'seconds').toDate(),
        isActive: false,
        duration: 30,
        address: `task with id 659a7f8ff6c2ca8247116a7c`,
        owner: userId,
        task: task._id,
      },
      {
        start: dayjs().add(-7, 'days').toDate(),
        end: dayjs().add(30, 'seconds').toDate(),
        isActive: false,
        duration: 30,
        address: `task with id 659a7f8ff6c2ca8247116a7c`,
        owner: userId,
        task: task._id,
      },
      {
        start: dayjs().add(-8, 'days').toDate(),
        end: dayjs().add(30, 'seconds').toDate(),
        isActive: false,
        duration: 30,
        address: `task with id 659a7f8ff6c2ca8247116a7c`,
        owner: userId,
        task: task._id,
      },
    ]);
    await this.taskModel.updateOne(
      { _id: task._id },
      { $set: { history: trackers.map((i) => i._id) } },
    );

    return;
  }
}
