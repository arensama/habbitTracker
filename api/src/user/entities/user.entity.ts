import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Task } from 'src/task/entities/task.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  //   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tracker' })
  // avatar: Tracker;

  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task' })
  tasks: Task[];
}

export const UserSchema = SchemaFactory.createForClass(User);
