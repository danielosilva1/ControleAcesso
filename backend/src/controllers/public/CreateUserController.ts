import { Request, Response } from 'express';
import { db } from '../../db';
import bcrypt from 'bcrypt';

class CreateUserController {
    async handle(req: Request, res: Response) {
        try {
            let {fullname, email, username, password} = req.body;

            if (!(fullname && email && username && password)) {
                return res.status(400).json({message: "Fullname, email, username and password are required fields"});
            }

            // Verificando se já há usuário com mesmo username
            const userAlreadyExist = await db.user.findFirst({
                where: { username: { equals: username,
                                     mode: 'insensitive' // Busca no modo case-insensitive
                    }
                }
            });

            if (userAlreadyExist) {
                return res.status(400).json({error: "User already exist"});
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

            return res.status(201).json({user});

        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { CreateUserController };