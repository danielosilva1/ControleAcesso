import { Router } from 'express';
import acl from 'express-acl';

import { CreateUserController } from '../controllers/public/CreateUserController';
import { LoginController } from '../controllers/public/LoginController';


const routes = Router();

/* Rotas públicas (não requerem autorização) */
routes.post('/sigin', new CreateUserController().handle);
routes.post('/login', new LoginController().handle);

/* Rotas que requerem de autorização, somente */


/* Rotas que requerem permissão de administrador */

export { routes };