import { Request, Response } from 'express';
import { db } from '../../db';

class GetAllUsersController {
    async handle(req: Request | any, res: Response) {

        const users = await db.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                fullname: true,
                password: false,
                role: true
            }
        });

        return res.status(200).json({users});
    }
}

export { GetAllUsersController };