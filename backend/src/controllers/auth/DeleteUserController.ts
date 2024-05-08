import { Request, Response } from 'express';
import { db } from '../../db';
import { Prisma } from '@prisma/client';

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
            /* Erro Prisma que pode ocorrer:
               1. Usuário a ser deletado não foi encontrado com base no di
            */
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    // P2025: An operation failed because it depends on one or more records that were required but not found. {cause}
                    return res.status(400).json({message: "User not found"});
                }
            }
        }
    }
}

export { DeleteUserController };