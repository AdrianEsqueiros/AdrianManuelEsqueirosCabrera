import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtRequest } from '../interfaces/jwt.request.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: JwtRequest) => {
          return request?.jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  validate(payload: any) {
    return { ...payload };
  }
}
