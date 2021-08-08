import { Request, Response } from 'express'
import userGames from '../models/userGames'

class userController {
    async addWin (req: Request, res: Response ) {
        return res.send(req.userId)
    }
}

export default new userController()