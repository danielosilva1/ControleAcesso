import { Request, Response } from 'express';
import { db } from '../../db';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

/* Atualização pode ser:
   1. Do usuário logado;
   2. De um usuário com base no id: id passado como parâmetro da requisição
*/
class UpdateUserController {
    async handle(req: Request | any, res: Response) {
        try {
            let id = req.params.id; // Id do usuário que será atualizado
            let { fullname, email, password, role } = req.body;

            if (!(fullname && email && role)) {
                return res.status(400).json({message: "Fullname, email and role are required fields"});
            }

            if (!id) {
                // Id não informado na requisição: atualiza dados do usuário logado
                id = req.user.id;
            }

            // Verificando se usuário existe
            const user = await db.user.findUnique({
                where: { id: Number(id) }
            });

            if (!user) {
                return res.status(400).json({message: "User not found"});
            }

            // Apenas administradores podem tornar um usuário administrador
            if (req.user.role != 'admin') {
                // Usuário que está atualizando perfil não é admin: role DEVE ser auth
                role = 'auth'
            }

            // Criptografa senha, caso ela vá ser alterada
            let hashedPass;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                hashedPass = await bcrypt.hash(password, salt);
            }

            const updatedUser = await db.user.update({
                where: { id: Number(id) },
                data: {
                    fullname,
                    email,
                    password: password == undefined ? user.password : hashedPass,
                    role
                }
            });

            return res.status(200).json({user: updatedUser});
        } catch (error) {
            /* Erro que pode ocorrer:
               1. Restrição de chave única no email
            */
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    // "P2002: Unique constraint failed on the {constraint}"
                    return res.status(400).json({message: "Already exists user with same email"})
                }
            }

            console.error(error);
            throw(error);
        }
    }
}

export { UpdateUserController };