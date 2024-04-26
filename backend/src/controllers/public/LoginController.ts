import { Request, Response, response } from 'express';
import {db} from '../../db';
import bcrypt from 'bcrypt';

const jwt = require('jsonwebtoken');

class LoginController {
    async handle(req: Request, res: Response) {
        let { username, password } = req.body;

        if (!(username && password)) {
            return res.status(400).json({error: 'Username and password are required fields'});
        }

        // Buscando dados do usuário pelo username informado
        const user = await db.user.findFirst({
            where: { username: { equals: username, mode: 'insensitive' }}
        });

        // Valida a senha
        if (user && (await bcrypt.compare(password, user.password))) {
            // Usuário cadastrado e credenciais corretas: gera token
            const token = jwt.sign(
                { id: user.id,
                  role: user.role
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: process.env.EXPIRES_IN }
            );

            res.setHeader('Authorization', `Bearer ${token}`); // Adiciona token ao cabeçalho da resposta

            return res.status(200).json({
                username,
                token
            });
        };

        return res.status(400).json({error: 'Username and/or password invalid'})
    }
}

export { LoginController };