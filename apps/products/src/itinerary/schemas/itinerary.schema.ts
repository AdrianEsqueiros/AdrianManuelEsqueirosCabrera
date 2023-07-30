import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import {SchemaTypes, Types} from "mongoose";


@Schema({ versionKey: false })
export class Itinerary extends AbstractDocument {
  @Prop({ required: true })
  originCity: string;

  @Prop({ required: true })
  destinationCity: string;

  @Prop({ required: true })
  departureTime: Date;

  @Prop({ required: true })
  arrivalTime: Date;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'Bus' })
  busId:  Types.ObjectId;
}

export const ItinerarySchema = SchemaFactory.createForClass(Itinerary);
