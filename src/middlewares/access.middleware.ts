import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken' 

interface TokenInterface {
    userId: string
}

export default (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS')
        return next()

    const accessToken = req.cookies.accessToken

    if (!accessToken)
        return res.status(401).send({message: 'Token not provided'})
    
    try {
        const decoded = jwt.verify(accessToken, `${process.env.JWT_SECRET}`)

        req.userId = (decoded as TokenInterface).userId 
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError)
        return res.status(401).send({message: "Token expired"})

        if (e instanceof jwt.JsonWebTokenError)
            return res.status(401).send({message: "Invalid token"})

        return res.status(500).send({message: "Server error"})
    }

    next()
}