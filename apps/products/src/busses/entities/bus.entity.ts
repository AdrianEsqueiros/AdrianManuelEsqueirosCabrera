import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Itinerary } from '../../itinerary/entities/itinerary.entity';

@Entity({ name: 'busses' })
export class Bus extends AbstractEntity<Bus> {
  @Column({ unique: true, name: 'license_plate' })
  licensePlate: string;

  @Column({ unique: true, name: 'bus_driver' })
  busDriver: string;

  @Column({ name: 'total_seats' })
  totalSeats: number;

  @OneToMany(() => Itinerary, (itinerary) => itinerary.bus, { cascade: true })
  itineraries: Itinerary[];
  @Column({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)',
    update: false,
  })
  created_at: string;
}
