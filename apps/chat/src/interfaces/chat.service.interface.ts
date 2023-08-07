import { CreateMessageDto } from '../dto/create-message.dto';
import { ConversationEntity } from '../domain/entities/conversation.entity';
import { MessageEntity } from '../domain/entities/message.entity';

export interface ChatServiceInterface {
  createMessage(dto: CreateMessageDto, userId: number): Promise<MessageEntity>;
  createConversation(
    userId: number,
    senderId: number,
  ): Promise<ConversationEntity>;
  getConversations(userId: number): Promise<ConversationEntity[]>;
}
