import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import nodeMailer from 'nodemailer'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

import tokenHelper from '../helpers/token.helper'

import User from '../models/User'
import userGames from '../models/userGames'
import secredUserCode from '../models/secredUserCode'

const cookieCofig = {
    access: {
        cookieOptns: {
            path: '/',
            httpOnly: true,
            secure: true,
        }
    },
    refresh: {
        cookieOptns: {
            path: '/auth',
            httpOnly: true,
            secure: true, 
            maxAge: 7*24*60*60*1000
        }
    }
}

const updateTokens = async (userId: string) => {
    const accessToken = tokenHelper.generateAccessToken(userId)
    const refreshToken = tokenHelper.generateRefreshToken()

    await tokenHelper.replaceDbRefreshToken(refreshToken.id, userId)

    return {
        accessToken,
        refreshToken: refreshToken.token
    }
}

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    secure: false,
    requireTLS: true,
    auth: {
        user: `${process.env.MAILER_USER}`,
        pass: `${process.env.MAILER_PASS}`
    }
})

class authController {
    async register (req: Request, res: Response) {//Добавить валидацию
        const errors = validationResult(req)
        if (!errors.isEmpty()) 
            return res.status(400).json({ errors: errors.array() })

        try {
            const { name, email, password }: { name: string, email: string, password: string } = req.body

            const candidate = await User.findOne({email})
            if (candidate)
                return res.status(404).json({message: `User with this ${ email } already exist`})

            const hashPassword = await bcrypt.hash(password, 8);

            const newUser = new User({ name, email, password: hashPassword })
            await newUser.save()

            const secretCode = new secredUserCode({ userId: newUser.id, code: uuidv4() })
            await secretCode.save()

            await transporter.sendMail({
                from: 'Tic Tac Toe',
                to: email,
                subject: 'Verify email',
                text: `http://localhost:3000/auth/verify/user/${newUser.id}/${secretCode.code}`
            })

            return res.send({message: 'User was created'})
        } catch(e) {
            console.log(e)
            return res.status(500).send({message: "Server error"})
        }

    }

    async login (req: Request, res: Response) {//Добавить валидацию
        try {
            const { email, password }: { email: string, password: string } = req.body
            const thisUser = await User.findOne({email}, 'name email')
            const thisUserGames = await userGames.findOne({userId: thisUser?.id}, 'wins loses total')

            const { refreshToken, accessToken } = await updateTokens(thisUser?.id)

            res.cookie('refreshToken', refreshToken, cookieCofig.refresh.cookieOptns)
            res.cookie('accessToken', accessToken, cookieCofig.access.cookieOptns)
    
            return res.send({
                user: thisUser,
                gamesInfo: thisUserGames
            })
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: "Server error"})        
        }
    }
    
    async verifyAcount (req: Request, res:Response) {//Добавить валидацию
        try {
            const { id, code } = req.params

            const secretVerify = await secredUserCode.findOne({ userId: id, code })

            if (!secretVerify)
                return res.status(400).json({ message: 'Code was been expired' })

            await User.findByIdAndUpdate(id, { verified: true })
            await userGames.create({userId: id})
            return res.send({message: "User was verified"})
        } catch(e) {
            console.log(e)
            return res.status(500).send({message: "Server error"})         
        }       
    }
}

export default new authController()