import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Role } from '@app/common';
import { MessageEntity } from '../../../../chat/src/domain/entities/message.entity';
import { ConversationEntity } from '../../../../chat/src/domain/entities/conversation.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.PASSENGER,
  })
  role: Role;

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];

  @ManyToMany(
    () => ConversationEntity,
    (conversationEntity) => conversationEntity.users,
  )
  conversations: ConversationEntity[];
  @Column({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)',
    update: false,
  })
  created_at: string;
}
