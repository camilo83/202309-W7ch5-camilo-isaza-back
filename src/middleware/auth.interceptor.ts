import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import { Auth } from '../services/auth.js';
import { AuthenticatedRequest } from '../controllers/users.controller.js';

const debug = createDebug('W7E:auth:interceptor');

export class AuthInterceptor {
  constructor() {
    debug('Instantiated');
  }

  authorization(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenHeader = req.get('Authorization');
      if (!tokenHeader?.startsWith('Bearer'))
        throw new HttpError(401, 'Unauthorized');
      const token = tokenHeader.split(' ')[1];
      const tokenPayload = Auth.verifyAndGetPayload(token);
      req.body.userId = tokenPayload.id;
      next();
    } catch (error) {
      next(error);
    }
  }

  authorization2(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenHeader = req.get('Authorization');
      if (!tokenHeader?.startsWith('Bearer'))
        throw new HttpError(401, 'Unauthorized');
      const token = tokenHeader.split(' ')[1];
      const tokenPayload = Auth.verifyAndGetPayload(token);

      // Asignar tokenPayload a req
      (req as AuthenticatedRequest).tokenPayload = tokenPayload;

      next();
    } catch (error) {
      next(error);
    }
  }
}
