import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './entities/task.entity';
import { TrackerModule } from 'src/tracker/tracker.module';
import { Tracker, TrackerSchema } from 'src/tracker/entities/tracker.entity';

@Module({
  imports: [
    TrackerModule,
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Tracker.name, schema: TrackerSchema },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
