import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: ['member', 'admin', 'super-admin'],
    default: 'member',
  })
  role: string;

  @Prop({ unique: true, required: true })
  username: string; // Used for login (email)

  @Prop({ required: true, select: false }) // select: false hides it by default
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member' })
  member_id: mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
