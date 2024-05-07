import { Router } from 'express';
import acl from 'express-acl';

import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { CreateUserController } from '../controllers/public/CreateUserController';
import { LoginController } from '../controllers/public/LoginController';
import { GetLoggedUserController } from '../controllers/auth/GetLoggedUserController';
import { GetUserByIdController } from '../controllers/admin/GetUserByIdController';
import { GetUserByUsernameController } from '../controllers/admin/GetUserByUsernameController';

const routes = Router();

/* Rotas públicas (não requerem autorização) */
routes.post('/sigin', new CreateUserController().handle);
routes.post('/login', new LoginController().handle);

routes.use(new AuthMiddleware().handle);
routes.use(acl.authorize);
/* Rotas a partir daqui passam pelo middleware de autenticação */

/* Rotas que requerem autorização, somente */
routes.get('/auth/get-logged-user', new GetLoggedUserController().handle);

/* Rotas que requerem permissão de administrador */
routes.get('/admin/get-user-by-id/:id', new GetUserByIdController().handle);
routes.get('/admin/get-user-by-username/:username', new GetUserByUsernameController().handle);

export { routes };