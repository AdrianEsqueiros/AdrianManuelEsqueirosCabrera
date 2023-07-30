import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class Bus extends AbstractDocument {
  @Prop({ required: true, unique: true })
  licensePlate: string;

  @Prop({ required: true })
  busDriver: string;

  @Prop({ required: true})
  totalSeats: number;

  @Prop({ required: true})
  availableSeats: number;
}

export const BusSchema = SchemaFactory.createForClass(Bus);
