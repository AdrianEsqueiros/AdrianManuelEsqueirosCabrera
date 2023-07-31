import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class Billing extends AbstractDocument {
    @Prop()
    itinerary_id: number;
    @Prop()
    seats_count: number;
    @Prop()
    seat_type: string;
    @Prop()
    passenger_id: string;
    @Prop()
    total_price: number;
    @Prop()
    id: number;
    @Prop({type:Object})
    itinerary: {};
    @Prop()
    Authentication: string;
    @Prop({type:Object})
    user: {};

}

export const BillingSchema = SchemaFactory.createForClass(Billing);
