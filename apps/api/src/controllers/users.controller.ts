import { sendMicroserviceMessage } from '@app/common';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from 'apps/auth/src/dto/create-user.dto';
import { SignInDto } from '../../../auth/src/dto/sign-in-dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Post('/register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Register a new user',
  })
  async register(@Body() dto: CreateUserDto) {
    return sendMicroserviceMessage(this.authService, 'register', dto);
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Login a user',
    description: 'Login a user',
  })
  async signIn(@Body() dto: SignInDto) {
    return sendMicroserviceMessage(this.authService, 'signIn', dto);
  }
}
