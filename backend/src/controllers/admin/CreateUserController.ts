import { Request, Response } from 'express';
import { db } from '../../db';
import bcrypt from 'bcrypt';

class CreateUserController {
    async handle(req: Request, res: Response) {
        try {
            let { fullname, email, username, password, role } = req.body;

            if (!(fullname && email && username && password && role)) {
                return res.status(400).json({message: "Fullname, email, username, password and role are required fields"});
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

            // Valida email: deve ser único
            const emailAlreadyExists = await db.user.findFirst({
                where: { email } // Verifica se há outro usuário com mesmo email
            });
            
            if (emailAlreadyExists) {
                return res.status(400).json({message: "Already exists user with same email"})
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
                    role
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