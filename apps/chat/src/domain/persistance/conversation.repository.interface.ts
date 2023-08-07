import { BaseInterfaceRepository } from '@app/common';
import { ConversationEntity } from '../entities/conversation.entity';

export interface ConversationRepositoryInterface
  extends BaseInterfaceRepository<ConversationEntity> {
  getConversations(userId: number): Promise<ConversationEntity[]>;
  findConversation(
    userId: number,
    senderId: number,
  ): Promise<ConversationEntity>;
}
