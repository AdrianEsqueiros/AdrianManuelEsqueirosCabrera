import { Column, Entity } from 'typeorm';import {AbstractEntity} from "@app/common/databaseSQL/abstract.entity";

@Entity({name:'bookings'})
export class Booking extends AbstractEntity<Booking> {

    @Column()
    itinerary: number;

    @Column()
    passenger: number;

    @Column()
    bus: number;

    @Column({ type: 'enum', enum: ['Turista', 'Ejecutivo', 'Premium'] })
    seatType: 'Turista' | 'Ejecutivo' | 'Premium';

    @Column()
    seatsCount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number;
}