import { Column, Entity } from 'typeorm';import {AbstractEntity} from "@app/common/databaseSQL/abstract.entity";
import {SeatType} from "../enums/seatType";

@Entity({name:'bookings'})
export class Booking extends AbstractEntity<Booking> {

    @Column()
    itinerary_id: number;

    @Column()
    passenger_id: string;

    @Column({ type: 'enum', enum: SeatType})
    seat_type: string;

    @Column()
    seats_count: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_price: number;
}