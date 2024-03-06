import mongoose, { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { JwtPayloadDto } from 'src/auth/dto/req.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tracker } from './entities/tracker.entity';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import * as dayjs from 'dayjs';
import { Task } from 'src/task/entities/task.entity';

@Injectable()
export class TrackerService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,

    @InjectModel(Tracker.name) private trackerModel: Model<Tracker>,
  ) {}

  async create(
    user: JwtPayloadDto,
    createTrackerDto: CreateTrackerDto,
  ): Promise<Tracker> {
    const { ...rest } = createTrackerDto;

    const tracker = new this.trackerModel({ ...rest, owner: user.sub });

    await tracker.save();
    await this.taskModel.updateOne(
      { _id: createTrackerDto.task },
      { $addToSet: { history: tracker?._id } },
    );
    return tracker;
  }
  async findAll(user: JwtPayloadDto) {
    const userId = new mongoose.Types.ObjectId(user.sub);
    const tasks = await this.trackerModel.aggregate([
      { $match: { owner: userId } },
      {
        $lookup: {
          from: 'tasks', // Assuming the name of the Tracker collection
          localField: 'task',
          foreignField: '_id',
          as: 'task',
        },
      },
      {
        $project: {
          _id: 1,
          start: 1,
          end: 1,
          duration: 1,
          task: 1,
        },
      },
    ]);
  }

  async home(user: JwtPayloadDto) {
    const userId = new mongoose.Types.ObjectId(user.sub);
    const trackers = await this.trackerModel.aggregate([
      { $match: { owner: userId, isActive: false } },
      {
        $lookup: {
          from: 'tasks', // Assuming the name of the Tracker collection
          localField: 'task',
          foreignField: '_id',
          as: 'task',
        },
      },
      {
        $unwind: '$task',
      },
      {
        $project: {
          _id: 1,
          duration: 1,
          start: 1,
          taskId: '$task._id',
          taskTitle: '$task.title',
          icon: '$task.icon',
          color: '$task.color',
          totalDurationPerDay: {
            $multiply: ['$task.duration', '$task.timesPerDay'],
          },
        },
      },
      {
        $group: {
          _id: {
            taskId: '$taskId',
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$start' },
            },
          },
          tracker: { $first: '$$ROOT' },
          dailyDuration: { $sum: '$duration' },
        },
      },
      {
        $addFields: {
          percent: {
            $toInt: {
              $min: [
                {
                  $multiply: [
                    {
                      $divide: [
                        '$dailyDuration',
                        '$tracker.totalDurationPerDay',
                      ],
                    },
                    100,
                  ],
                },
                100,
              ],
            },
          },
          taskTitle: '$tracker.taskTitle',
          icon: '$tracker.icon',
          color: '$tracker.color',
          start: '$tracker.start',
        },
      },
    ]);
    return trackers;
  }

  async task(user: JwtPayloadDto, taskId: string): Promise<Tracker[]> {
    const userId = new mongoose.Types.ObjectId(user.sub);
    const trackers = await this.trackerModel.aggregate([
      {
        $match: {
          task: new mongoose.Types.ObjectId(taskId),
          owner: userId,
          isActive: false,
        },
      },
      {
        $lookup: {
          from: 'tasks', // Assuming the name of the Tracker collection
          localField: 'task',
          foreignField: '_id',
          as: 'task',
        },
      },
      {
        $unwind: '$task',
      },
      {
        $project: {
          _id: 1,
          duration: 1,
          start: 1,
          taskId: '$task._id',
          taskTitle: '$task.title',
          icon: '$task.icon',
          color: '$task.color',
          totalDurationPerDay: {
            $multiply: ['$task.duration', '$task.timesPerDay'],
          },
        },
      },
      {
        $group: {
          _id: {
            taskId: '$taskId',
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$start' },
            },
          },
          tracker: { $first: '$$ROOT' },
          dailyDuration: { $sum: '$duration' },
        },
      },
      {
        $addFields: {
          percent: {
            $toInt: {
              $min: [
                {
                  $multiply: [
                    {
                      $divide: [
                        '$dailyDuration',
                        '$tracker.totalDurationPerDay',
                      ],
                    },
                    100,
                  ],
                },
                100,
              ],
            },
          },
          taskTitle: '$tracker.taskTitle',
          icon: '$tracker.icon',
          color: '$tracker.color',
          start: '$tracker.start',
        },
      },
    ]);
    return trackers;
  }
  findOne(user: JwtPayloadDto, _id: string) {
    return this.trackerModel.findOne({ owner: user.sub, _id }).exec();
  }

  update(user: JwtPayloadDto, _id: string, updateTrackerDto: UpdateTrackerDto) {
    const { ...rest } = updateTrackerDto;

    const tracker = new this.trackerModel({ ...rest });
    return tracker.save();
  }

  remove(user: JwtPayloadDto, _id: string) {
    return this.trackerModel.deleteOne({ owner: user.sub, _id }).exec();
  }

  async addnew(user: JwtPayloadDto, createTrackerDto: CreateTrackerDto) {
    const { task } = createTrackerDto;
    const exists = await this.trackerModel.findOne({
      isActive: true,
      owner: user.sub,
    });

    if (exists) {
      await this.trackerModel.deleteOne({
        where: { isActive: true, owner: user.sub },
      });
    }

    const todayDate = dayjs().toDate();

    const tracker = new this.trackerModel({
      isActive: true,
      start: todayDate,
      task,
      owner: user.sub,
    });
    await tracker.save();
    await this.taskModel.updateOne(
      { _id: task },
      { $addToSet: { history: tracker?._id } },
    );
    return tracker;
  }
  async getActive(user: JwtPayloadDto) {
    const instance = await this.trackerModel
      .findOne({
        isActive: true,
        owner: user.sub,
      })
      .populate('task');
    return instance;
  }
  async endTracker(user: JwtPayloadDto) {
    const tracker = await this.trackerModel.findOne({
      isActive: true,
      owner: user.sub,
    });

    if (!tracker) {
      throw new HttpException('tracker doesnt exist', HttpStatus.BAD_REQUEST);
    }

    const todayDate = dayjs().toDate();
    tracker.end = todayDate;
    const endDate = dayjs();
    const startDate = dayjs(tracker.start);
    tracker.duration = endDate.diff(startDate, 'second');
    tracker.isActive = false;
    return tracker.save();
  }
}
