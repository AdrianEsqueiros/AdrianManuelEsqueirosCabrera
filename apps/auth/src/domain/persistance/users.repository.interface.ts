import { UserEntity } from '../entity/user.entity';
import { BaseInterfaceRepository } from '@app/common';

export interface UserRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {}
