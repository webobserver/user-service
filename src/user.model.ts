import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  hashedPassword: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
