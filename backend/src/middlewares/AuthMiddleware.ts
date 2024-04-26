import { NextFunction, Request, Response } from 'express';

const jwt = require('jsonwebtoken');

class AuthMiddleware {
    async handle(req: Request | any, res: Response, next: NextFunction) {
        const token_ = req.headers.Authorization;

        if (!token_) {
            return res.status(401).json({error: "Token not provided"});
        }

        const [, token] = token_.split(" ");

        try {
            // Decodificando e validando token
            const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // Adiciona objeto user (contendo id e role) à requisição
            // Esse objeto será acessado pelo acl-express!!
            req.user = {
                id: data.id,
                role: data.role
            };

            return next();
        } catch (error) {
            return res.status(401).json({error: "Token invalid"});
        }
    }
}

export { AuthMiddleware };