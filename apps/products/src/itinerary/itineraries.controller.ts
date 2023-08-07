import { BadRequestException, Controller, Inject } from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { SharedServiceInterface } from '@app/common';
import { Itinerary } from './entities/itinerary.entity';
import { SearchItinerariesRequest } from './dto/search-itineraries.request';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';

@Controller()
export class ItinerariesController {
  constructor(
    private readonly itinerariesService: ItinerariesService,
    @Inject('SharedServiceInterface')
    private sharedService: SharedServiceInterface,
  ) {}

  @MessagePattern({ cmd: 'create_itinerary' })
  async createItinerary(
    @Ctx() context: RmqContext,
    @Payload() request: CreateItineraryDto,
  ): Promise<Itinerary> {
    try {
      const itinerary = await this.itinerariesService.createItinerary(request);
      this.sharedService.acknowledgeMessage(context);
      return itinerary;
    } catch (e) {
      throw new RpcException(e);
    }
  }
  @MessagePattern({ cmd: 'get_itineraries' })
  async getItineraries(@Ctx() context: RmqContext): Promise<Itinerary[]> {
    try {
      const itinerary = this.itinerariesService.getItineraries();
      this.sharedService.acknowledgeMessage(context);
      if (!itinerary) {
        throw new BadRequestException(`No se pudo obtener los itinerario.`);
      }
      return itinerary;
    } catch (e) {
      throw new RpcException(e);
    }
  }
  @MessagePattern({ cmd: 'search_itineraries' })
  async searchItineraries(
    @Ctx() context: RmqContext,
    @Payload() request: SearchItinerariesRequest,
  ): Promise<Itinerary[]> {
    try {
      const itinerary = await this.itinerariesService.searchItineraries(
        request,
      );
      this.sharedService.acknowledgeMessage(context);
      if (!itinerary) {
        throw new BadRequestException(`No se pudo obtener los itinerario.`);
      }
      return itinerary;
    } catch (e) {
      throw new RpcException(e);
    }
  }
  @MessagePattern({ cmd: 'get_itineraries_by_id' })
  async getItineraryById(
    @Ctx() context: RmqContext,
    @Payload() request: number,
  ): Promise<Itinerary> {
    try {
      this.sharedService.acknowledgeMessage(context);
      const itinerary = await this.itinerariesService.findBy(request);
      if (itinerary) {
        return itinerary;
      } else {
        throw new BadRequestException(`No se encontro Itinerario.`);
      }
    } catch (e) {
      throw new RpcException(e);
    }
  }
  @MessagePattern({ cmd: 'update_itineraries' })
  async updateItinerary(
    @Ctx() context: RmqContext,
    @Payload() request: UpdateItineraryDto,
  ): Promise<Itinerary> {
    try {
      const itinerary = await this.itinerariesService.update(request);
      console.log(itinerary);
      this.sharedService.acknowledgeMessage(context);
      if (!itinerary) {
        throw new BadRequestException(
          `No se encontro Itinerario con el id ${request.id}.`,
        );
      }
      return itinerary;
    } catch (e) {
      throw new RpcException(e);
    }
  }
  @EventPattern('booking_created')
  async itineraryUpdated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    const seatsRemain = data.itinerary.availableSeats - data.seatsCount;
    if (seatsRemain < 0) {
      throw new BadRequestException('No hay suficientes asientos disponibles.');
    }
    try {
      await this.itinerariesService.updateSeats(data.itineraryId, {
        availableSeats: seatsRemain,
      });
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
