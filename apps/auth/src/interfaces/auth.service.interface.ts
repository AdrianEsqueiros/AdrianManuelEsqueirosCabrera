import { CreateUserDto } from '../dto/create-user.dto';
import { TokenInterface } from './token.interface';
import { SignInDto } from '../dto/sign-in-dto';
import { UserEntity } from '../domain/entity/user.entity';

export interface AuthServiceInterface {
  findByEmail(email: string): Promise<UserEntity>;
  hashPassword(password: string): Promise<string>;
  register(dto: CreateUserDto): Promise<{ access_token: string }>;
  validateUser(email: string, password: string): Promise<UserEntity>;
  login(dto: SignInDto): Promise<{ access_token: string }>;
  verifyJwtToken(token: string): Promise<TokenInterface>;
  decodeJwtToken(token: string): Promise<TokenInterface>;
  signJwtToken(payload: { role: string; sub: number }): Promise<string>;
  doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean>;
  getOnroadsTeam(userId: number): Promise<UserEntity[]>;
  getUserById(id: number): Promise<UserEntity>;
}
