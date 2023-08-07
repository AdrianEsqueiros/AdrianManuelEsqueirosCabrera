import { BadRequestException, Controller, Inject } from '@nestjs/common';
import { BussesService } from './busses.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { SharedServiceInterface } from '@app/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { Bus } from './entities/bus.entity';

@Controller()
export class BussesController {
  constructor(
    private readonly bussesService: BussesService,
    @Inject('SharedServiceInterface')
    private sharedService: SharedServiceInterface,
  ) {}

  @MessagePattern({ cmd: 'create_buses' })
  async createBooking(
    @Ctx() context: RmqContext,
    @Payload() request: CreateBusDto,
  ): Promise<Bus> {
    try {
      const bus = await this.bussesService.createBus(request);
      this.sharedService.acknowledgeMessage(context);
      if (!bus) {
        throw new RpcException(`No se pudo crear el bus.`);
      }
      return bus;
    } catch (e) {
      throw new RpcException(e);
    }
  }
  @MessagePattern({ cmd: 'get_busses' })
  async getBusses(@Ctx() context: RmqContext): Promise<Bus[]> {
    try {
      const bus = this.bussesService.getBuses();
      this.sharedService.acknowledgeMessage(context);
      if (!bus) {
        throw new BadRequestException(`No se pudo obtener los buses.`);
      }
      return bus;
    } catch (e) {
      return;
    }
  }
}
