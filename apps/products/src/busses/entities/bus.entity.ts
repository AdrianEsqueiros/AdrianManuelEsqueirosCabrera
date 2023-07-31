import { Column, Entity,OneToMany } from 'typeorm';
import {AbstractEntity} from "@app/common/databaseSQL/abstract.entity";
import {Itinerary} from "../../itinerary/entities/itinerary.entity";


@Entity({name:'busses'})
export class Bus extends AbstractEntity<Bus> {
    @Column({ unique: true })
    license_plate: string;

    @Column({ unique: true })
    bus_driver: string;

    @Column()
    total_seats: number;

    @OneToMany(() => Itinerary, (itinerary) => itinerary.bus, { cascade: true })
    itineraries: Itinerary[];
}
