import { Router } from 'express';
import acl from 'express-acl';

import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { SignUpController } from '../controllers/public/SignUpController';
import { LoginController } from '../controllers/public/LoginController';
import { GetLoggedUserController } from '../controllers/auth/GetLoggedUserController';
import { DeleteUserController } from '../controllers/auth/DeleteUserController';
import { UpdateUserController } from '../controllers/auth/UpdateUserController';
import { CreateUserController } from '../controllers/admin/CreateUserController';
import { GetUserByIdController } from '../controllers/admin/GetUserByIdController';
import { GetUserByUsernameController } from '../controllers/admin/GetUserByUsernameController';

const routes = Router();

/* Rotas públicas (não requerem autorização) */
routes.post('/sigin', new SignUpController().handle);
routes.post('/login', new LoginController().handle);

routes.use(new AuthMiddleware().handle);
routes.use(acl.authorize);
/* Rotas a partir daqui passam pelo middleware de autenticação */

/* Rotas que requerem autorização, somente */
routes.get('/auth/get-logged-user', new GetLoggedUserController().handle);
routes.put('/auth/update-user', new UpdateUserController().handle);
routes.delete('/auth/delete-user', new DeleteUserController().handle);

/* Rotas que requerem permissão de administrador */
routes.post('/admin/create-user', new CreateUserController().handle);
routes.get('/admin/get-user-by-id/:id', new GetUserByIdController().handle);
routes.get('/admin/get-user-by-username/:username', new GetUserByUsernameController().handle);
routes.put('/admin/update-user/:id?', new UpdateUserController().handle);
routes.delete('/admin/delete-user/:id?', new DeleteUserController().handle);

export { routes };