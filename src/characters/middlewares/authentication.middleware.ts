import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  //   use(req: any, res: any, next: () => void) {
  //     console.log('authenticating');
  //     next();
  //   }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token =
        req.headers.authorization ?? (req.query.token as string | undefined);

      if (!token) {
        throw new UnauthorizedException('Token needed.');
      }

      //   const data = this.jwtProvider.verify(token.replace("Bearer ", ""));

      //   const userInfo: any = {
      //     name: data.name,
      //     email: data.email,
      //     id: data.sub!,
      //   };

      //   res.locals.authenticatedUser = userInfo;
      next();
    } catch (err) {
      throw new UnauthorizedException((err as Error).message);
    }
  }
}
