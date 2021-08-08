import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken' 
import refreshToken from '../models/refreshToken'

class authHelper {
    generateAccessToken (userId: string) {
        const payload = {
            userId,
            type: 'access'
        };
        const options = { expiresIn: '30m' };
    
        return jwt.sign(payload, `${process.env.JWT_SECRET}`, options);
    }

    generateRefreshToken () {
        const payload = {
            id: uuidv4(),
            type: 'refresh'
        };
        const options = { expiresIn: '7d' };
    
        return {
            id: payload.id,
            token: jwt.sign(payload, `${process.env.JWT_SECRET}`, options)
        };
    }

    async replaceDbRefreshToken (tokenId: string, userId: string) {
        await refreshToken.findOneAndRemove({ userId })
        await refreshToken.create({tokenId, userId})
    }
}

export default new authHelper()

