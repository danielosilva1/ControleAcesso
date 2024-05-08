import { Request, Response } from 'express';
import { db } from '../../db';

/* Deleção pode ser:
   1. Do usuário logado;
   2. De um usuário com base no id: id passado como parâmetro da requisição
*/
class DeleteUserController {
    async handle(req: Request | any, res: Response) {
        let id = req.params.id; // Id do usuário que será deletado

        if (!id) {
            // Id não informado na requisição: deleta dados do usuário logado
            id = req.user.id;
        }

        try {
            const user = await db.user.delete({
                where: { id: Number(id) }
            });
            return res.status(200).json({user});
        } catch (error) {
            // Usuário não foi encontrado com base no di
            return res.status(400).json({message: "User not found"});
        }
    }
}

export { DeleteUserController };