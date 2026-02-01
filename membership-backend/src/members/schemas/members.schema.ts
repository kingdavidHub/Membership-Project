import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Dependent extends Document {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member' })
  member_id: mongoose.Types.ObjectId;
}

export const DependentSchema = SchemaFactory.createForClass(Dependent);

@Schema()
export class Member extends Document {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop()
  age: number;

  @Prop()
  membership_id: string;

  @Prop()
  entry_year: number;

  @Prop({ enum: ['paid', 'unpaid', 'pending'], default: 'pending' })
  payment_status: string;

  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  member_status: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dependent' }] })
  dependents: mongoose.Types.ObjectId[];
}

export const MemberSchema = SchemaFactory.createForClass(Member);
