import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@app/common';
import { sendMicroserviceMessage } from '@app/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BILLING_SERVICE } from '@app/common/rmq/services';

@ApiTags('Billings')
@Controller('billings')
export class BillingController {
  constructor(
    @Inject('BILLING_SERVICE') private billingsService: ClientProxy,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find Billings',
    description: 'Find Billings',
  })
  async getBy(@Req() req: Request) {
    return sendMicroserviceMessage(
      this.billingsService,
      'get_billing_by_user',
      {
        userId: req.user.id,
      },
    );
  }
}
