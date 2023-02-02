import mongoose from "mongoose";
mongoose.set('strictQuery', true);

const userSchema=mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
})

const user = mongoose.model('user',userSchema);
export default user;