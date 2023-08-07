import {
  BadRequestException,
  Controller,
  Inject,
  UseGuards,
} from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { BillingService } from './billing.service';
import { SharedServiceInterface } from '@app/common';

@Controller()
export class BillingController {
  constructor(
    @Inject('SharedServiceInterface')
    private sharedService: SharedServiceInterface,
    private readonly billingService: BillingService,
    private readonly rmqService: RmqService,
  ) {}
  @MessagePattern({ cmd: 'get_billing_by_user' })
  async getItineraryById(
    @Ctx() context: RmqContext,
    @Payload() payload: { userId: number },
  ) {
    try {
      const billing = await this.billingService.findBillingsByUser(
        payload.userId,
      );
      this.sharedService.acknowledgeMessage(context);
      if (!billing) {
        throw new BadRequestException(`No se encontro ningun billing.`);
      }
      return billing;
    } catch (e) {
      return;
    }
  }
  @EventPattern('order_created')
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.billingService.bill(data);
    this.rmqService.acknowledgeMessage(context);
  }
}
