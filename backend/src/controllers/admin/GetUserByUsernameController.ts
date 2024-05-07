import { Request, Response } from 'express';
import { db } from '../../db';

class GetUserByUsernameController {
    async handle(req: Request | any, res: Response) {
        const username = req.params.username;

        if (!username) {
            return res.status(400).json({message: "Username of searched user is required as a requisition parameter"})
        }

        const user = await db.user.findFirst({
            where: { username: { equals: username, mode: 'insensitive' } }
        });

        if (!user) {
            return res.status(400).json({message: "User not found for the username informed"})
        }

        return res.status(200).json({user});
    }
}

export { GetUserByUsernameController };