import { Controller, Inject, UseGuards } from '@nestjs/common';

import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in-dto';
import { JwtGuard } from './guards/jwt.guard';
import { AuthServiceInterface } from './interfaces/auth.service.interface';
import { RmqService } from '@app/common';

@Controller()
export class AuthController {
  constructor(
    @Inject('AuthServiceInterface')
    private readonly authService: AuthServiceInterface,
    @Inject('SharedServiceInterface')
    private readonly sharedService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'register' })
  async register(@Ctx() context: RmqContext, @Payload() dto: CreateUserDto) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.register(dto);
  }

  @MessagePattern({ cmd: 'signIn' })
  async signIn(@Ctx() context: RmqContext, @Payload() dto: SignInDto) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.login(dto);
  }

  @MessagePattern({ cmd: 'verify-jwt' })
  @UseGuards(JwtGuard)
  async verifyJwt(
    @Ctx() context: RmqContext,
    @Payload() payload: { jwt: string },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return await this.authService.verifyJwtToken(payload.jwt);
  }

  @MessagePattern({ cmd: 'decode-jwt' })
  async decodeJwt(
    @Ctx() context: RmqContext,
    @Payload() payload: { jwt: string },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.decodeJwtToken(payload.jwt);
  }

  @MessagePattern({ cmd: 'get-onroads-team' })
  async getOnroadsTeam(
    @Ctx() context: RmqContext,
    @Payload() payload: { userId: number },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.getOnroadsTeam(payload.userId);
  }

  @MessagePattern({ cmd: 'get-user' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() user: { id: number },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.getUserById(user.id);
  }
}
