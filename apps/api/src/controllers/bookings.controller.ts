import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard, Role } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { sendMicroserviceMessage } from '@app/common';
import { CreateBookingDto } from '../../../orders/src/bookings/dto/create-booking.dto';
import { Request } from 'express';
import { Roles } from '../../../auth/src/decorators/roles.decorator';
import { RolesGuard } from '../../../auth/src/guards/roles.guard';
import { BOOKING_SERVICE } from '@app/common/rmq/services';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(
    @Inject('BOOKING_SERVICE') private bookingService: ClientProxy,
    @Inject('ITINERARIES_SERVICE') private itinerariesService: ClientProxy,
    @Inject(BOOKING_SERVICE) private bookingClient: ClientProxy,
  ) {}

  @Post('/create')
  @ApiOperation({
    summary: 'Make a reservation',
    description: 'Make a reservation.',
  })
  @ApiBearerAuth()
  @Roles(Role.PASSENGER)
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() dto: CreateBookingDto, @Req() req: Request) {
    const itinerary = await sendMicroserviceMessage(
      this.itinerariesService,
      'get_itineraries_by_id',
      dto.itineraryId,
    ).toPromise();
    return sendMicroserviceMessage(this.bookingService, 'create_booking', {
      ...dto,
      passengerId: req.user.id,
      itinerary,
    });
  }
}
