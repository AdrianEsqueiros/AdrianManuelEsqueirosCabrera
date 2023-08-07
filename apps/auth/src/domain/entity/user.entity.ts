import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  OneToMany,

  ManyToMany,
} from 'typeorm';
import {Role} from "@app/common/enums/role.enum";
import {MessageEntity} from "../../../chat/src/entities/message.entity";
import {ConversationEntity} from "../../../chat/src/entities/conversation.entity";




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
    default: Role.CUSTOMER,
  })
  role: Role;

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];

  @ManyToMany(
    () => ConversationEntity,
    (conversationEntity) => conversationEntity.users,
  )
  conversations: ConversationEntity[];

  // @OneToOne(() => CartEntity, (cart) => cart.user)
  // cart: CartEntity;
}
