import {BadRequestException, Controller, Get, Param, UseGuards} from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService, JwtAuthGuard } from '@app/common';
import { BillingService } from './billing.service';
import {CurrentUser} from "../../auth/src/current-user.decorator";
import {User} from "../../auth/src/users/schemas/user.schema";


@Controller('billings')
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getItineraryById(@CurrentUser() user: User){
    try {
      const itinerary= await this.billingService.findBillingsByUser(user._id);
      if(itinerary){
        return itinerary
      }
      else    {
        throw new BadRequestException(`No se encontro Itinerario.`);
      }
    } catch (e){
      throw e
    }
  }

  @EventPattern('order_created')
  @UseGuards(JwtAuthGuard)
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    await this.billingService.billing(data);
    this.rmqService.ack(context);
  }


}
