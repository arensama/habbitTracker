import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/user/entities/user.entity';

export type TrackerDocument = HydratedDocument<Tracker>;

@Schema({ timestamps: true })
export class Tracker extends Document {
  @Prop()
  start: Date;

  @Prop()
  end: Date;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: 0 })
  duration: number;

  @Prop({ default: '' })
  address: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task' })
  task: Task;
}

export const TrackerSchema = SchemaFactory.createForClass(Tracker);
