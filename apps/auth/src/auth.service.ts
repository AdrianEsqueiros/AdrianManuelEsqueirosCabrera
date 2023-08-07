import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { AuthServiceInterface } from './interfaces/auth.service.interface';
import { TokenInterface } from './interfaces/token.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in-dto';
import { RpcException } from '@nestjs/microservices';
import { UserRepositoryInterface } from './domain/persistance/users.repository.interface';
import { UserEntity } from './domain/entity/user.entity';
import { Role } from '@app/common';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  decodeJwtToken(token: string): Promise<TokenInterface> {
    if (!token) return;
    try {
      return this.jwtService.decode(token) as Promise<TokenInterface>;
    } catch (error) {
      throw new BadRequestException('El token no es válido');
    }
  }

  doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findByCondition({ where: { email } });
  }

  async getOnroadsTeam(userId: number): Promise<UserEntity[]> {
    const result = await this.userRepository.findAll({
      where: { role: Role.ONROAD },
    });

    if (result.length > 1) {
      return result.filter((user) => user.id !== userId);
    }
    return result;
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyJwtToken(token: string): Promise<TokenInterface> {
    return (await this.jwtService.verifyAsync(token)) as Promise<any>;
  }

  async register(dto: CreateUserDto): Promise<{ access_token: string }> {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new RpcException('El correo ya está registrado');
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const savedUser = await this.userRepository.save({
      ...dto,
      password: hashedPassword,
    });

    delete savedUser.password;
    const token = await this.jwtService.signAsync({
      id: savedUser.id,
      role: savedUser.role,
    });

    return {
      access_token: token,
    };
  }

  async login(dto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new RpcException('El correo o la contraseña son incorrectos');
    }
    const token = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
    });
    return {
      access_token: token,
    };
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userRepository.findByCondition({
      where: { email },
    });
    if (!user) {
      return null;
    }
    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );
    if (!doesPasswordMatch) return null;
    return user;
  }

  async signJwtToken(payload: { role: string; sub: number }): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async getUserById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOneById(id);
  }
}
