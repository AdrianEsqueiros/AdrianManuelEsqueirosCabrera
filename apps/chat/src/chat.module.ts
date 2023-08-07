import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import {
  AUTH,
  DatabaseSQLModule,
  RedisModule,
  SharedModule,
} from '@app/common';
import { MessageRepository } from './persistance/messages.repository';
import { ConversationRepository } from './persistance/conversations.repository';
import { ConversationEntity } from './domain/entities/conversation.entity';
import { MessageEntity } from './domain/entities/message.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/chat/.env',
    }),
    DatabaseSQLModule,
    RedisModule,
    SharedModule.registerRmq('AUTH_SERVICE', AUTH),
    TypeOrmModule.forFeature([ConversationEntity, MessageEntity]),
  ],
  controllers: [],
  providers: [
    ChatService,
    ChatGateway,
    {
      provide: 'MessageRepositoryInterface',
      useClass: MessageRepository,
    },
    {
      provide: 'ConversationRepositoryInterface',
      useClass: ConversationRepository,
    },
  ],
})
export class ChatModule {}
