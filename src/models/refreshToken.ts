import  { Schema, model } from 'mongoose'

interface refreshToken {
    tokenId: string,
    userId: string
}

const refreshTokenShema = new Schema<refreshToken>({
    tokenId: {
        type: String,
        require: true
    },
    userId: {
        type: String,
        require: true,
        unique: true
    }
})

export default model<refreshToken>('refreshToken', refreshTokenShema)