import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const user = request.user;

    return user;
  },
);
