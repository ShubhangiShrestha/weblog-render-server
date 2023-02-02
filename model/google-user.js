import mongoose from "mongoose";
mongoose.set('strictQuery', true);

const googleuserSchema=mongoose.Schema({
    sub: {
        type: String,
        required: true,
        unique:true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
    }
})

const googleUser = mongoose.model('googleUser',googleuserSchema);
export default googleUser;