import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { UsersMongoRepo } from '../repos/users.mongo.repo.js';
import { Auth, TokenPayload } from '../services/auth.js';
import { User } from '../entities/user.js';
import { Controller } from './controller.js';

const debug = createDebug('W7E:users:controller');

export interface AuthenticatedRequest extends Request {
  tokenPayload: TokenPayload;
}

export class UsersController extends Controller<User> {
  constructor(protected repo: UsersMongoRepo) {
    super(repo);
    debug('Instantiated');
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = req.body.userId
        ? await this.repo.getById(req.body.userId) // ????
        : await this.repo.login(req.body);

      const data = {
        user: result,
        token: Auth.signJWT({
          id: result.id,
          email: result.email,
        }),
      };
      debug(data);
      res.status(202);
      res.statusMessage = 'Accepted';
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async addFriend(req: Request, res: Response, next: NextFunction) {
    try {
      debug('hola');
      const typedReq = req as AuthenticatedRequest;
      const userFriendId = req.params.id;

      debug(userFriendId);

      const loggedUserId = typedReq.tokenPayload.id;
      debug(loggedUserId);
      debug(req.params.id);
      // Convertir el ID a ObjectId
      const userFriend = await this.repo.getById(req.params.id);
      debug(userFriend);

      if (!userFriend) {
        // Manejar el caso donde el usuario amigo no fue encontrado
        return res
          .status(404)
          .json({ message: 'Usuario amigo no encontrado.' });
      }

      // Verificar si el usuario ya es amigo para evitar duplicados
      const user = await this.repo.getById(loggedUserId);
      if (user.friends.some((friend) => friend.id === userFriendId)) {
        return res
          .status(400)
          .json({ message: 'Este usuario ya es tu amigo.' });
      }

      // Agregar userFriend a la lista de amigos del usuario logueado
      const updatedUser = await this.repo.addFriend(loggedUserId, userFriend);

      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
}
