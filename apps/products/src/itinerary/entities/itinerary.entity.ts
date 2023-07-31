import { Column, Entity,  ManyToOne } from 'typeorm';
import {AbstractEntity} from "@app/common/databaseSQL/abstract.entity";
import {Bus} from "../../busses/entities/bus.entity";
import {Provinces} from "../enums/provinces";

@Entity({name:'itineraries'})
export class Itinerary extends AbstractEntity<Itinerary> {
    @Column({
        type: 'enum',
        enum: Provinces,
    })
    origin_city: string;

    @Column({
        type: 'enum',
        enum: Provinces,
    })
    destination_city: string;

    @Column()
    departure_time: Date;

    @Column()
    arrival_time: Date;

    @Column()
    available_seats: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => Bus, (bus) => bus.itineraries)
    bus: Bus;
}
