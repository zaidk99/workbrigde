import { JwtPayload } from "../types/jwt.types";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload ;
    }
  }
}