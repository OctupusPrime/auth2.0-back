import { Router } from "express"
import authController from "../controllers/auth.controller"
import hasToken from '../middlewares/access.middleware'
import { body } from 'express-validator'

const router = Router()

router.post('/reg', 
                body('name').isLength({min: 4, max: 12}),
                body('email').isEmail(),
                body('password').isLength({ min: 5, max: 12 }),
                (authController.register))
router.get('/verify/user/:id/:code', authController.verifyAcount)
router.post('/log', authController.login)

export default router

