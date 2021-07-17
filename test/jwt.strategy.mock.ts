import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as StrategyMock } from 'passport-jwt-mock';

@Injectable()
export class JwtStrategyMock extends PassportStrategy(StrategyMock) {
  constructor() {
    super({});
  }

  validate(payload: unknown): unknown {
    return payload;
  }
}
