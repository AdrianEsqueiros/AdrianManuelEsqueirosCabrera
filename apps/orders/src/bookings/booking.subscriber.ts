import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Logger } from '@nestjs/common';
import {Booking} from "./entities/booking.entity";

@EventSubscriber()
export class BookingSubscriber implements EntitySubscriberInterface<Booking> {
  private readonly logger = new Logger(BookingSubscriber.name);

  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Booking;
  }

  beforeInsert(event: InsertEvent<Booking>): void | Promise<any> {
    this.logger.log(`beforeInsert`, JSON.stringify(event.entity));
  }

  afterInsert(event: InsertEvent<Booking>): void | Promise<any> {
    this.logger.log(`afterInsert`, JSON.stringify(event.entity));
  }
}
