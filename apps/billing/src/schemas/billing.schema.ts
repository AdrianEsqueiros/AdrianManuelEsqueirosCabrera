import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class Billing extends AbstractDocument {
  @Prop()
  id: number;
  @Prop()
  itineraryId: number;
  @Prop()
  seatsCount: number;
  @Prop()
  seatType: string;
  @Prop()
  passengerId: string;
  @Prop()
  totalPrice: number;
  @Prop({ type: Object })
  itinerary: {};
  @Prop({ type: Object })
  user: {};
}

export const BillingSchema = SchemaFactory.createForClass(Billing);
