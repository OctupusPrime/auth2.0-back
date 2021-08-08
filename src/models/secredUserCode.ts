import  { Schema, model } from 'mongoose'

interface secretCode {
    userId: string,
    code: string,
    createAt: Date
}

const secredUserCodeShema = new Schema<secretCode>({
    userId: { 
        type: String, 
        required: true
    },
    code: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now(),
        expires: 600,
    }
})

export default model<secretCode>('secredUserCode', secredUserCodeShema)