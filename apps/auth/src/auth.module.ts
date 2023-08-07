import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtGuard } from './guards/jwt.guard';
import { SharedModule } from '@app/common';
import { DatabaseSQLModule } from '@app/common';
import { UserEntity } from './domain/entity/user.entity';
import { RmqService } from '@app/common';
import { UserRepository } from './reporsitory/user.repository';
import { ConversationEntity } from '../../chat/src/domain/entities/conversation.entity';
import { MessageEntity } from '../../chat/src/domain/entities/message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    SharedModule,
    JwtModule.registerAsync({
      imports: undefined,
      useFactory: () => ({
        secret: 'secret',
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
    DatabaseSQLModule,
    TypeOrmModule.forFeature([UserEntity, ConversationEntity, MessageEntity]),
  ],
  controllers: [AuthController],
  providers: [
    JwtGuard,
    JwtStrategy,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService,
    },
    {
      provide: 'SharedServiceInterface',
      useClass: RmqService,
    },
  ],
})
export class AuthModule {}
