import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ChatServiceInterface } from './interfaces/chat.service.interface';
import { CreateMessageDto } from './dto/create-message.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ConversationRepositoryInterface } from './domain/persistance/conversation.repository.interface';
import { MessageRepositoryInterface } from './domain/persistance/message.repository.interface';
import { UserEntity } from '../../auth/src/domain/entity/user.entity';
import { ConversationEntity } from './domain/entities/conversation.entity';
import { MessageEntity } from './domain/entities/message.entity';

@Injectable()
export class ChatService implements ChatServiceInterface {
  constructor(
    @Inject('MessageRepositoryInterface')
    private readonly messageRepository: MessageRepositoryInterface,
    @Inject('ConversationRepositoryInterface')
    private readonly conversationRepository: ConversationRepositoryInterface,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  private async getUser(id: number) {
    const ob$ = this.authService.send<UserEntity>(
      {
        cmd: 'get-user',
      },
      { id },
    );

    return await firstValueFrom(ob$).catch((err) => console.error(err));
  }

  async createConversation(
    userId: number,
    senderId: number,
  ): Promise<ConversationEntity> {
    const user = await this.getUser(userId);
    const sender = await this.getUser(senderId);

    if (!user || !sender) return;

    const conversation = await this.conversationRepository.findConversation(
      userId,
      senderId,
    );

    if (conversation) {
      return conversation;
    }

    return await this.conversationRepository.save({
      users: [user, sender] as any,
    });
  }

  async createMessage(
    dto: CreateMessageDto,
    userId: number,
  ): Promise<MessageEntity> {
    const conversation = await this.conversationRepository.findByCondition({
      where: {
        id: dto.conversationId,
      },
      relations: ['users'],
    });

    if (!conversation) return;

    return await this.messageRepository.save({
      message: dto.message,
      conversation,
      user: userId as any,
    });
  }

  async getConversations(userId: number): Promise<any[]> {
    const result = await this.conversationRepository.getConversations(userId);
    return result.map((conv) => ({
      id: conv.id,
      userIds: conv.users.map((user) => ({
        id: user.id,
        name: user.name,
      })),
      lastUpdated: conv.lastUpdated,
    }));
  }
}
