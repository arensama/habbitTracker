import { Module, forwardRef } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { TrackerController } from './tracker.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tracker, TrackerSchema } from './entities/tracker.entity';
import { TaskModule } from 'src/task/task.module';
import { Task, TaskSchema } from 'src/task/entities/task.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tracker.name, schema: TrackerSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  controllers: [TrackerController],
  providers: [TrackerService],
  exports: [TrackerService],
})
export class TrackerModule {}
