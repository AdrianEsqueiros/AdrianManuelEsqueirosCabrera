import { Injectable, Logger } from '@nestjs/common';
import { BillingsRepository } from './billings.repository';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  constructor(private readonly billingsRepository: BillingsRepository) {}

  getHello(): string {
    return 'Hello World!';
  }

  async billing(data: any) {
    const { user } = data;
    const { password, ...safeUser } = user;
    const processData = { ...data, user: safeUser };
    this.logger.log('Billing...', processData);
    await this.billingsRepository.create(processData);
  }
  async findBillingsByUser(id: any) {
    return this.billingsRepository.find({ passenger_id: id });
  }
  bill(data: any) {
    this.logger.log('Billing...', data);
    return this.billingsRepository.create(data);
  }
}
