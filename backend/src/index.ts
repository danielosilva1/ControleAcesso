import express, { json } from 'express';
import acl from 'express-acl';

import { routes } from './routes';
import { config, responseObject } from './config/acl';

const app = express();
const cors = require('cors');

const corsOption = {
    credentials: true,
    origin: 'http://localhost:3000'
}

// middlewares
app.use(express.json());

// routes
app.use(cors(corsOption));
app.use(routes);
acl.config(config, responseObject);

// run server
const port = 8000;
app.listen(port, () => { console.log("Server is running on port " + port + "...") });