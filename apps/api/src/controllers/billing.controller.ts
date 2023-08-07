import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '@app/common';
import { sendMicroserviceMessage } from '@app/common/helpers/send-message-microservice';
import { ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../../../auth/src/current-user.decorator';
import { User } from '../../../auth/src/users/schemas/user.schema';

@Controller('billings')
export class BillingController {
  constructor(
    @Inject('BILLING_SERVICE') private billingsService: ClientProxy,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Find Billings',
    description: 'Find Billings',
  })
  async getBy(@CurrentUser() user: User) {
    return sendMicroserviceMessage(
      this.billingsService,
      'get_billing_by_user',
      user,
    );
  }
}
