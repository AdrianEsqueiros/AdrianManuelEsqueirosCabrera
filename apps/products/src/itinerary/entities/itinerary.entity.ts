import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Bus } from '../../busses/entities/bus.entity';
import { Provinces } from '../enums/provinces';

@Entity({ name: 'itineraries' })
export class Itinerary extends AbstractEntity<Itinerary> {
  @Column({
    type: 'enum',
    enum: Provinces,
    name: 'origin_city',
  })
  originCity: string;

  @Column({
    type: 'enum',
    enum: Provinces,
    name: 'destination_city',
  })
  destinationCity: string;

  @Column({ name: 'departure_time' })
  departureTime: Date;

  @Column({ name: 'arrival_time' })
  arrivalTime: Date;

  @Column({ name: 'available_seats' })
  availableSeats: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Bus, (bus) => bus.itineraries)
  bus: Bus;

  @Column({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)',
    update: false,
  })
  created_at: string;
}
