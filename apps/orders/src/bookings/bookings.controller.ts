import { BadRequestException, Controller, Inject } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedServiceInterface } from '@app/common';
import { Booking } from './entities/booking.entity';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE, BOOKING_SERVICE } from '../constants/services';

@Controller()
export class BookingsController {
  constructor(
    private readonly bookingService: BookingsService,
    @Inject('SharedServiceInterface')
    private sharedService: SharedServiceInterface,
    @Inject(BOOKING_SERVICE) private bookingClient: ClientProxy,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}
  @MessagePattern({ cmd: 'create_booking' })
  async createBooking(
    @Ctx() context: RmqContext,
    @Payload() payload: any,
  ): Promise<Booking> {
    this.sharedService.acknowledgeMessage(context);
    const book = await this.bookingService.createBooking(payload);
    if (!book) {
      throw new BadRequestException(`No se pudo crear la reserva.`);
    }
    this.billingClient.emit('order_created', book);
    await lastValueFrom(this.bookingClient.emit('booking_created', book));
    return book;
  }
}
