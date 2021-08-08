import  { Schema, model } from 'mongoose'

interface User {
    name: string,
    email: string,
    password: string,
    verified: boolean
}

const userSchema = new Schema<User>({
    name: { 
        type: String, 
        requierd: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    verified: {
        type: Boolean,
        default: false
    }
})

export default model<User>('User', userSchema)