import { Request, Response } from 'express';
import { db } from '../../db';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

class CreateUserController {
    async handle(req: Request, res: Response) {
        try {
            let { fullname, email, username, password, role } = req.body;

            if (!(fullname && email && username && password && role)) {
                return res.status(400).json({message: "Fullname, email, username, password and role are required fields"});
            }

            // Criptografa a senha do usuário usando hash code
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(password, salt);

            // Cadastra novo usuário
            const user = await db.user.create({
                data: {
                    fullname,
                    email,
                    username,
                    password: hashedPass,
                    role
                }
            });

            return res.status(201).json({user});
        } catch (error) {
            /* Erros do Prisma que podem ocorrer:
               1. Restrição de chave única do username; ou
               2. Restrição de chave única do email.
            */
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    // "P2002: Unique constraint failed on the {constraint}"
                    return res.status(400).json({message: "Already exists user with same username or email"});
                }
            }

            console.error(error);
            throw(error);
        }
    }
}

export { CreateUserController };