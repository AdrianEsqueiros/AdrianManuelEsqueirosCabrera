import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import {UserRole} from "../user-roles.enum";

@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: String, enum: Object.values(UserRole), default: UserRole.USER })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
