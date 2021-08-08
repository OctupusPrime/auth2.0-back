import { Request, Response } from 'express'
import userGames from '../models/userGames'

class userController {
    async addWin (req: Request, res: Response ) {
        return res.send(1)
    }
}

export default new userController()