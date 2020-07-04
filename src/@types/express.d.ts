import { UserDto } from '~/users/dtos/user.dto';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: UserDto;
  }
}
