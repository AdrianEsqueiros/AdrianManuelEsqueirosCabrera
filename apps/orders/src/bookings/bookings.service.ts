import {BadRequestException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {EntityManager, Repository} from "typeorm";
import {Booking} from "./entities/booking.entity";
import {BILLING_SERVICE, BOOKING_SERVICE} from "../constants/services";
import {ClientProxy} from "@nestjs/microservices";
import {CreateBookingDto} from "./dto/create-booking.dto";
import {ItineraryService} from "./service/itinerary.service";

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>,
        private readonly entityManager: EntityManager,
        private readonly itineraryService: ItineraryService,
        @Inject(BOOKING_SERVICE) private bookingClient: ClientProxy,
        @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
    ) {
    }

    async createBooking(request: CreateBookingDto, user: any, authentication: string, ) {
        try{
            const itinerary = await this.itineraryService.getItineraryById(
                request.itinerary_id,
            );
            if (!itinerary)
                throw new NotFoundException('No se encontro Itinerario.')
            if(itinerary.available_seats-request.seats_count < 0 )
                throw new BadRequestException(`No hay suficientes asientos, ${itinerary.available_seats} disponibles. `)
            const booking = new Booking({
                ...request,
                passenger_id:user._id,
                total_price: itinerary.price * request.seats_count
            });
            const booked = await this.entityManager.save(booking);
            this.bookingClient.emit('booking_created',booked);
            this.billingClient.emit('order_created', {
                ...booked,
                itinerary,
                Authentication: authentication
            })
            return booked;
        }
        catch (e){
            throw e
        }
    }
}