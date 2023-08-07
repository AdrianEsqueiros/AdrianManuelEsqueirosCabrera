import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../domain/entity/user.entity';
import { UserRepositoryInterface } from '../domain/persistance/users.repository.interface';
import { BaseAbstractRepository } from '@app/common';

@Injectable()
export class UserRepository extends BaseAbstractRepository<UserEntity>
  implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity)
    readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }
}
