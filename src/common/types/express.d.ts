import { JwtPayload } from 'jsonwebtoken';

export interface AuthUser extends JwtPayload {
  id: number;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
