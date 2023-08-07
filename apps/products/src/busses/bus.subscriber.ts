import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Logger } from '@nestjs/common';
import { Bus } from './entities/bus.entity';

@EventSubscriber()
export class BusSubscriber implements EntitySubscriberInterface<Bus> {
  private readonly logger = new Logger(BusSubscriber.name);

  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Bus;
  }

  beforeInsert(event: InsertEvent<Bus>): void | Promise<any> {
    this.logger.log(`beforeInsert`, JSON.stringify(event.entity));
  }

  afterInsert(event: InsertEvent<Bus>): void | Promise<any> {
    this.logger.log(`afterInsert`, JSON.stringify(event.entity));
  }
}
