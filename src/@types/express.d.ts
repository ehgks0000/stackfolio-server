export {};
import { User } from '../users/entity/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      // user?: import('../users/entity/user.entity.ts').default;
    }
  }
}
