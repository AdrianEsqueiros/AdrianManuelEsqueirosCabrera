import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { SeatType } from '../enums/seatType';

@Entity({ name: 'bookings' })
export class Booking extends AbstractEntity<Booking> {
  @Column({ name: 'itinerary_id' })
  itineraryId: number;

  @Column({ name: 'passenger_id' })
  passengerId: number;

  @Column({ type: 'enum', enum: SeatType, name: 'seat_type' })
  seatType: string;

  @Column({ name: 'seats_count' })
  seatsCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_price' })
  totalPrice: number;

  @Column({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)',
    update: false,
  })
  created_at: string;
}
