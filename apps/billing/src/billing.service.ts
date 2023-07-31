import { Injectable, Logger } from '@nestjs/common';
import {BillingsRepository} from "./billings.repository";
import {Billing} from "./schemas/billing.schema";
import {FilterQuery} from "mongoose";


@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  constructor(private readonly billingsRepository: BillingsRepository) {}

  getHello(): string {
    return 'Hello World!';
  }

  async billing(data: any) {
    const {user} = data
    const {password, ...safeUser}=user
    const processData = {...data,user:safeUser}
    this.logger.log('Billing...',processData);
    await this.billingsRepository.create(processData);
  }
  async findBillingsByUser(id: any):Promise<Billing>{
    return this.billingsRepository.find({passenger_id:id})
  }
}
