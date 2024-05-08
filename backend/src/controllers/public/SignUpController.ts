import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { db } from '../../db';
import bcrypt from 'bcrypt';

class SignUpController {
    async handle(req: Request, res: Response) {
        try {
            let {fullname, email, username, password} = req.body;

            if (!(fullname && email && username && password)) {
                return res.status(400).json({message: "Fullname, email, username and password are required fields"});
            }

            // Criptogra a senha do usuário usando hash code
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(password, salt);

            // Cadastra novo usuário
            const user = await db.user.create({
                data: {
                    fullname,
                    email,
                    username,
                    password: hashedPass,
                    role: 'auth'
                }
            });

            return res.status(201).json({ user });
        } catch (error) {
            /* Erros do Prisma que podem ocorrer:
               1. Restrição de chave única no username; ou
               2. Restrição de chave única no email.
            */
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    // "P2002: Unique constraint failed on the {constraint}"
                    return res.status(400).json({error: "Already exists user with same username or email"});
                }
            }

            console.error(error);
            throw(error);
        }
    }
}

export { SignUpController };