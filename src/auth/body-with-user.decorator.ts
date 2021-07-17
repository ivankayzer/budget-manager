import {
  createParamDecorator,
  ExecutionContext,
  applyDecorators,
  Body,
} from '@nestjs/common';
import { ValidationPipe } from '../validation.pipe';

export const BodyWithUserId = (): any => {
  const userIdDecorator = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      request.body.userId = request.user.sub;
    },
  );

  return applyDecorators(
    userIdDecorator() as ClassDecorator,
    Body(new ValidationPipe()) as ClassDecorator,
  );
};
