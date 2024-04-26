import express, { json } from 'express';
import acl from 'express-acl';

import { routes } from './routes';
import { config, responseObject } from './config/acl';

const app = express();

// middlewares
app.use(express.json());

// routes
app.use(routes);
acl.config(config, responseObject);

// run server
const port = 8000;
app.listen(port, () => { console.log("Server is running on port " + port + "...") });