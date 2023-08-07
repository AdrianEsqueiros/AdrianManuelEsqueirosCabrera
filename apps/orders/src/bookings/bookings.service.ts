import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly entityManager: EntityManager,
  ) {}

  async createBooking(request: any) {
    try {
      const itinerary = request.itinerary;
      if (!itinerary) throw new NotFoundException('No se encontro Itinerario.');

      if (itinerary.availableSeats - request.seatsCount < 0)
        throw new BadRequestException(
          `No hay suficientes asientos, ${itinerary.availableSeats} disponibles.`,
        );

      const booking = new Booking({
        ...request,
        totalPrice: itinerary.price * request.seatsCount,
      });
      return await this.entityManager.save(booking);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
