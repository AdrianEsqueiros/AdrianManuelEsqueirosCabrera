import { BaseInterfaceRepository } from '@app/common';
import { MessageEntity } from '../entities/message.entity';

export interface MessageRepositoryInterface
  extends BaseInterfaceRepository<MessageEntity> {}
