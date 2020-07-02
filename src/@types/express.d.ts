import { User } from '../users';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: User;
  }
}
