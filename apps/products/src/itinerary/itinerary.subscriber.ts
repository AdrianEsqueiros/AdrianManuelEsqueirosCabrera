import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Logger } from '@nestjs/common';
import { Itinerary } from './entities/itinerary.entity';

@EventSubscriber()
export class ItinerarySubscriber
  implements EntitySubscriberInterface<Itinerary> {
  private readonly logger = new Logger(ItinerarySubscriber.name);

  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Itinerary;
  }

  beforeInsert(event: InsertEvent<Itinerary>): void | Promise<any> {
    this.logger.log(`beforeInsert`, JSON.stringify(event.entity));
  }

  afterInsert(event: InsertEvent<Itinerary>): void | Promise<any> {
    this.logger.log(`afterInsert`, JSON.stringify(event.entity));
  }
}
