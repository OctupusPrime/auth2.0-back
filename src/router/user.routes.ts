import { Router } from "express"
import userController from "../controllers/user.controller"
import hasToken from '../middlewares/access.middleware'

const router = Router()

// router.use(hasToken)

// router.post('/add', userController.addWin)

export default router

