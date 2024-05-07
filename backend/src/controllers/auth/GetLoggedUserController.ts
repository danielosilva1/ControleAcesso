import { Request, Response } from 'express';
import { db } from '../../db';

class GetLoggedUserController {
    async handle(req: Request | any, res: Response) {
        const id = req.user.id; // id do usuário logado: setado antes pelo middleware

        const loggedUser = await db.user.findUnique({
            where: { id }
        });

        if (!loggedUser) {
            return res.status(400).json({message: "An error occurred while getting logged user"});
        }

        return res.status(200).json({user: loggedUser});
    }
}

export { GetLoggedUserController };