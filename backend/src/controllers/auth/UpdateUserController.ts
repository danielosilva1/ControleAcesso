import { Request, Response } from 'express';
import { db } from '../../db';
import bcrypt from 'bcrypt';

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

            // Valida email: deve ser único
            const emailAlreadyExists = await db.user.findFirst({
                where: { id: { not: Number(id) }, email } // Verifica se há outro usuário com mesmo email
            });
            
            if (emailAlreadyExists) {
                return res.status(400).json({message: "Already exists user with same email"})
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
            console.error(error);
            throw(error);
        }
    }
}

export { UpdateUserController };