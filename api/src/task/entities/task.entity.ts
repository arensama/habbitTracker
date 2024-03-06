import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Tracker } from 'src/tracker/entities/tracker.entity';
import { User } from 'src/user/entities/user.entity';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ default: 0 })
  icon: number;

  @Prop({ default: 0 })
  color: number;

  @Prop({ default: 0 })
  timesPerDay: number;

  @Prop({ default: false })
  hasDuration: boolean;

  @Prop({ default: 0 })
  duration: number;

  @Prop({ default: '' })
  title: string;

  @Prop({ default: [] })
  schedule: number[];

  // @Prop({ default: false })
  // repeatable: boolean;

  @Prop({ default: 0 })
  currentStreak: number;

  @Prop({ default: 0 })
  longestStreak: number;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: [{ type: mongoose.Schema.ObjectId, ref: 'Tracker' }] })
  history: Tracker[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
