import { Request, Response } from 'express';
import { db } from '../../db';

class GetUserByIdController {
    async handle(req: Request | any, res: Response) {
        let id = req.params.id;

        console.log(id);

        if (!id) {
            return res.status(400).json({message: "Id of searched user is required as a requisition parameter"})
        }

        const user = await db.user.findUnique({
            where: { id: Number(id) }
        });

        if (!user) {
            return res.status(400).json({message: "User not found for the id informed"})
        }

        return res.status(200).json({user});
    }
}

export { GetUserByIdController };