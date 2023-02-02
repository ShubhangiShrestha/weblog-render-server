import mongoose from 'mongoose';

mongoose.set('strictQuery', true);
const Connection = async(URL) =>{
    try{
        await mongoose.connect(URL,{useNewUrlParser:true});
        console.log("Connected Successfully");
    }catch(error){
        console.log("Error",error);
    }
}
export default Connection;