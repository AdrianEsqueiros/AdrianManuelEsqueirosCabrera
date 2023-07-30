import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';

import {ItinerariesRepository} from "./itineraries.repository";
import {CreateItineraryRequest} from "./dto/create-itinerary.request";
import {BussesRepository} from "../busses/busses.reporsitory";
import {Types} from "mongoose";
import {SearchItinerariesRequest} from "./dto/search-itineraries.request";


@Injectable()
export class ItinerariesService {
    constructor(
        private readonly itineraryRepository: ItinerariesRepository,
        private readonly bussesRepository: BussesRepository

) {}
    async createItinerary(request: CreateItineraryRequest, authentication: string) {
        await this.validateCreateItineraryRequest(request);
        const session = await this.itineraryRepository.startTransaction();
        try {

            const bus = await this.bussesRepository.findOne({_id:request.busId});

            const itinerary = await this.itineraryRepository.create({
                ...request,
                busId: bus._id,
            }, { session });

            await session.commitTransaction();
            return itinerary;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        }
    }


    private async validateCreateItineraryRequest(request: CreateItineraryRequest) {
        if (!Types.ObjectId.isValid(request.busId)) {
            throw new BadRequestException('Invalid busId');
        }
        const departureTime = new Date(request.departureTime);
        const arrivalTime = new Date(request.arrivalTime);
        if (departureTime.getTime() === arrivalTime.getTime()) {
            throw new BadRequestException('El horario de salida y llegada no pueden ser iguales.');
        }
        const overlappingItineraries = await this.itineraryRepository.find({});
        for (const itinerary of overlappingItineraries) {
            // @ts-ignore
            if (itinerary.busId == request.busId) {
                const itineraryStart = new Date(itinerary.departureTime);
                const itineraryEnd = new Date(itinerary.arrivalTime);
                const newItineraryStart = new Date(request.departureTime);
                const newItineraryEnd = new Date(request.arrivalTime);

                if (
                    (itineraryStart >= newItineraryStart && itineraryStart < newItineraryEnd) ||
                    (itineraryEnd > newItineraryStart && itineraryEnd <= newItineraryEnd)
                ) {
                    throw new BadRequestException('El itinerario se cruza con otros itinerarios existentes.');
                }
            }
        }
    }
    async getItinerary() {
        return this.itineraryRepository.find({});
    }
    async searchItineraries(originCity: string, destinationCity: string) {
        if (originCity === destinationCity) {
            throw new BadRequestException('La ciudad de origen y destino no pueden ser iguales.');
        }

        // Use the current date as the search parameter
        const currentDate = new Date();

        // Search itineraries with the given origin, destination, and date (current date)
        const itineraries = await this.itineraryRepository.find({
            originCity,
            destinationCity,
            departureTime: { $gte: currentDate.toISOString() }, // Convert current date to ISO string for database query
        });

        if (itineraries.length === 0) {
            throw new NotFoundException('No se encontraron itinerarios para estas ciudades.');
        }

        return itineraries;
    }
}
