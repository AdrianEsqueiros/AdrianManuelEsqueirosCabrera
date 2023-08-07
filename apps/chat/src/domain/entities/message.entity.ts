import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { UserEntity } from '../../../../auth/src/domain/entity/user.entity';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.messages)
  user: UserEntity;

  @ManyToOne(
    () => ConversationEntity,
    (conversationEntity) => conversationEntity.messages,
  )
  conversation: ConversationEntity;

  @Column({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)',
    update: false,
  })
  createdAt: string;
}
