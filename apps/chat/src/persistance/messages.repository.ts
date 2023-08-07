import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from '@app/common';
import { MessageRepositoryInterface } from '../domain/persistance/message.repository.interface';
import { MessageEntity } from '../domain/entities/message.entity';

@Injectable()
export class MessageRepository extends BaseAbstractRepository<MessageEntity>
  implements MessageRepositoryInterface {
  constructor(
    @InjectRepository(MessageEntity)
    readonly messageRepository: Repository<MessageEntity>,
  ) {
    super(messageRepository);
  }
}
