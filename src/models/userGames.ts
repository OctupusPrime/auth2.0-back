import  { Schema, model } from 'mongoose'

interface Games {
    userId: string,
    wins: number,
    loses: number,
    total: number
}

const userGamesShema = new Schema<Games>({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    wins: {
        type: Number,
        default: 0
    },
    loses: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    } 
})

export default model<Games>('UserGames', userGamesShema)