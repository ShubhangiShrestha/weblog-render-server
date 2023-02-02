import mongoose from "mongoose";
mongoose.set('strictQuery', true);

const otpSchema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    code: {
        type: String,
        required: true
    },
    newPassword:{
        type:String,
        required:true
    },
    expireIn : {
        type: Number
    },
})

const Otp = mongoose.model('Otp',otpSchema);
export default Otp;