import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {EntityManager, Repository, MoreThanOrEqual, LessThanOrEqual} from "typeorm";
import {Itinerary} from "./entities/itinerary.entity";
import {CreateItineraryDto} from "./dto/create-itinerary.dto";
import {first} from "rxjs";
import {BussesService} from "../busses/busses.service";


@Injectable()
export class ItinerariesService {

    constructor(
        @InjectRepository(Itinerary)
        private readonly itineraryRepository: Repository<Itinerary>,
        private readonly bussesService:BussesService,
        private readonly entityManager: EntityManager,
    ) {
    }

    async createItinerary(request: CreateItineraryDto ) {
        const bus = await this.validateCreateItineraryRequest(request)
        try{
            const itinerary = new Itinerary({
                ...request,
                available_seats:bus.total_seats
            });
            return await this.entityManager.save(itinerary);
        }
        catch (e){
            if (e.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new BadRequestException('El bus especificado no existe.');
            } else {

                throw e;
            }
        }
    }
    async getItineraries() {
        return this.itineraryRepository.find({
                relations: { bus:true},
            }
        );

    }

    async searchItineraries(originCity: string, destinationCity: string) {
        if (originCity === destinationCity) {
            throw new BadRequestException('La ciudad de origen y destino no pueden ser iguales.');
        }

        // Use the current date as the search parameter
        const currentDate = new Date();

        // Search itineraries with the given origin, destination, and date (current date)
        const itineraries = await this.itineraryRepository.find({
            relations: { bus:true},
            where:[
                {
                    origin_city:originCity,
                    destination_city:destinationCity,
                },
                {
                    departure_time: currentDate
                }
            ]

        });

        if (itineraries.length === 0) {
            throw new NotFoundException('No se encontraron itinerarios para estas ciudades.');
        }

        return itineraries;
    }
    private async validateCreateItineraryRequest(request: CreateItineraryDto) {

        const departureTime = new Date(request.departure_time);
        const arrivalTime = new Date(request.arrival_time);
        const now = new Date();
        now.setHours(now.getHours() - 5); // Restar 5 horas al huso horario actual
        const bus = await this.bussesService.findOne(request.bus.id);

        if (departureTime.getTime() === arrivalTime.getTime()) {
            throw new BadRequestException('El horario de salida y llegada no pueden ser iguales.');
        }
        if (departureTime.getTime() < now.getTime() || arrivalTime.getTime() < now.getTime()) {
            throw new BadRequestException('El itinerario no puede tener una fecha menor a la fecha actual.');
        }
        if (departureTime.getTime() > arrivalTime.getTime() || arrivalTime.getTime() < departureTime.getTime()) {
            throw new BadRequestException('El itinerario no puede tener una fecha de salida menor a la fecha de llegada.');
        }
        const overlappingItineraries = await this.itineraryRepository.find({
            relations: ['bus'],
            where: [
                {
                    bus: request.bus,
                    destination_city: request.destination_city,
                    origin_city:request.origin_city,
                    departure_time: MoreThanOrEqual(departureTime),
                    arrival_time: LessThanOrEqual(arrivalTime),
                },
                {
                    bus: request.bus ,
                    destination_city: request.destination_city,
                    origin_city:request.origin_city,
                    departure_time: LessThanOrEqual(arrivalTime),
                    arrival_time: MoreThanOrEqual(departureTime),
                }
            ]
        });
        if (overlappingItineraries.length > 0) {
            for (const itinerary of overlappingItineraries) {
                // @ts-ignore
                if (request.bus === itinerary.bus.id){

                    throw new BadRequestException(overlappingItineraries.filter(e=>{
                        if(e.bus.id===request.bus.id)
                        return e
                    }),`El itinerario del bus ${request.bus} se cruza con los siguientes itinerarios existentes. `);
                }
            }
        }
        return bus;
    }
    async findBy(id:number){
        return this.itineraryRepository.findOneBy({id});
    }
    async findOneBy(id:number){
        return this.itineraryRepository.findOneBy({id});
    }
    async update(id:number,data:any):Promise<any>{
        const itinerary = await this.itineraryRepository.findOneBy({id})
        if (data === itinerary){
            return 'No se realizo ningun cambio.'
        }
        const bus = await this.validateCreateItineraryRequest(data)
        return await this.itineraryRepository.update(id, {...data,available_seats:bus.total_seats});
    }
    async updateSeats(id:number,data:any){
        return await this.itineraryRepository.update(id, data);
    }
}


