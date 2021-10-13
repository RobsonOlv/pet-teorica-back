import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    ra: String,
    cpf: Number,
    name: String,
    modalidade: Number,
    resultado: Object
})

export default mongoose.model('User', UserSchema)