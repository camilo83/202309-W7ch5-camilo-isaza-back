import { Router as createRouter } from 'express';
import {
  AuthenticatedRequest,
  UsersController,
} from '../controllers/users.controller.js';
import createDebug from 'debug';
import { UsersMongoRepo } from '../repos/users.mongo.repo.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';

const debug = createDebug('W7E:users:router');

export const usersRouter = createRouter();
debug('Starting');

const repo = new UsersMongoRepo();
const controller = new UsersController(repo);
const interceptor = new AuthInterceptor();

usersRouter.get('/', controller.getAll.bind(controller));
usersRouter.post('/register', controller.create.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
usersRouter.patch(
  '/login',
  interceptor.authorization.bind(interceptor),
  controller.login.bind(controller)
);
usersRouter.patch(
  '/:id',
  (req, res, next) =>
    interceptor.authorization2(
      req as unknown as AuthenticatedRequest,
      res,
      next
    ),
  controller.addFriend.bind(controller)
);
