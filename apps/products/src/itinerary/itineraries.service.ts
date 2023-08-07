import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { Itinerary } from './entities/itinerary.entity';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { BussesService } from '../busses/busses.service';
import { SearchItinerariesRequest } from './dto/search-itineraries.request';
import { stringify } from 'ts-jest';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ItinerariesService {
  constructor(
    @InjectRepository(Itinerary)
    private readonly itineraryRepository: Repository<Itinerary>,
    private readonly bussesService: BussesService,
    private readonly entityManager: EntityManager,
  ) {}

  async createItinerary(request: CreateItineraryDto) {
    const bus = await this.validateCreateItineraryRequest(request);
    try {
      const itinerary = new Itinerary({
        ...request,
        availableSeats: bus.totalSeats,
      });
      return await this.entityManager.save(itinerary);
    } catch (e) {
      if (e.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new BadRequestException('El bus especificado no existe.');
      } else {
        throw e;
      }
    }
  }
  async getItineraries() {
    return this.itineraryRepository.find();
  }

  async searchItineraries(dto: SearchItinerariesRequest) {
    if (dto.originCity === dto.destinationCity) {
      throw new BadRequestException(
        'La ciudad de origen y destino no pueden ser iguales.',
      );
    }

    const currentDate = new Date();

    const itineraries = await this.itineraryRepository.find({
      relations: ['bus'],
      where: [
        {
          originCity: dto.originCity,
          destinationCity: dto.destinationCity,
        },
        {
          departureTime: currentDate,
        },
      ],
    });

    if (itineraries.length === 0) {
      throw new NotFoundException(
        'No se encontraron itinerarios para estas ciudades.',
      );
    }

    return itineraries;
  }
  private async validateCreateItineraryRequest(request: CreateItineraryDto) {
    if (request.originCity === request.destinationCity) {
      throw new BadRequestException(
        'La ciudad de origen y destino no pueden ser iguales.',
      );
    }
    const departureTime = new Date(request.departureTime);
    const arrivalTime = new Date(request.arrivalTime);
    const now = new Date();
    now.setHours(now.getHours() - 5); // Restar 5 horas al huso horario actual
    const bus = await this.bussesService.findOne(request.bus.id);

    if (departureTime.getTime() === arrivalTime.getTime()) {
      throw new BadRequestException(
        'El horario de salida y llegada no pueden ser iguales.',
      );
    }
    if (
      departureTime.getTime() < now.getTime() ||
      arrivalTime.getTime() < now.getTime()
    ) {
      throw new BadRequestException(
        'El itinerario no puede tener una fecha menor a la fecha actual.',
      );
    }
    if (
      departureTime.getTime() > arrivalTime.getTime() ||
      arrivalTime.getTime() < departureTime.getTime()
    ) {
      throw new BadRequestException(
        'El itinerario no puede tener una fecha de salida menor a la fecha de llegada.',
      );
    }
    const overlappingItineraries = await this.itineraryRepository.find({
      relations: ['bus'],
      where: [
        {
          bus: request.bus,
          destinationCity: request.destinationCity,
          originCity: request.originCity,
          departureTime: MoreThanOrEqual(departureTime),
          arrivalTime: LessThanOrEqual(arrivalTime),
        },
        {
          bus: request.bus,
          destinationCity: request.destinationCity,
          originCity: request.originCity,
          departureTime: LessThanOrEqual(arrivalTime),
          arrivalTime: MoreThanOrEqual(departureTime),
        },
      ],
    });
    if (overlappingItineraries.length > 0) {
      for (const itinerary of overlappingItineraries) {
        // @ts-ignore
        if (request.bus === itinerary.bus.id) {
          throw new BadRequestException(
            overlappingItineraries.filter((e) => {
              if (e.bus.id === request.bus.id) return e;
            }),
            `El bus ${request.bus} esta registrado con las siguientes fechas,
                    Llegada: ${stringify(
                      overlappingItineraries.map((e) => e.arrivalTime),
                    )}
                    Salida: ${stringify(
                      overlappingItineraries.map((e) => e.departureTime),
                    )},
                     porfavor intenta con otra fecha.
                    `,
          );
        }
      }
    }
    return bus;
  }
  async findBy(dto: number) {
    return this.itineraryRepository.findOneBy({ id: dto });
  }
  async findOneBy(id: number) {
    return this.itineraryRepository.findOneBy({ id });
  }
  async update(data: any): Promise<any> {
    try {
      const itinerary = await this.itineraryRepository.findOneBy({
        id: data.id,
      });

      if (!itinerary) {
        throw new RpcException(
          `No se encontro Itinerario con el id ${data.id}`,
        );
      }
      if (data === itinerary) {
        return 'No se realizo ningun cambio.';
      }
      const bus = await this.validateCreateItineraryRequest(data);
      return await this.itineraryRepository.update(data.id, {
        ...data,
        availableSeats: bus.totalSeats,
      });
    } catch (e) {
      console.log(e);
    }
  }
  async updateSeats(id: number, data: any) {
    return await this.itineraryRepository.update(id, data);
  }
}
