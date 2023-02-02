import bcrypt, { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validator from 'validator';
import Token from '../model/token.js'
import User from '../model/user.js';
import googleUser from '../model/google-user.js';
import {OAuth2Client} from 'google-auth-library';
import nodemailer from 'nodemailer';
import Generator from 'generate-password';
import Otp from '../model/otp.js';

const client=new OAuth2Client('1013360049760-2aulnj43rj9giuruc9bfkhu7givv9qod.apps.googleusercontent.com');


dotenv.config();

export const singupUser = async (request, response) => {
    if(validator.isEmail(request.body.email)){
    try {
        const hashedPassword = await bcrypt.hash(request.body.password, 10);

        const user = { email: request.body.email, username: request.body.username, password: hashedPassword }
            const newUser = new User(user);
            await newUser.save();

            return response.status(200).json({ msg: 'Signup successfull' });
    } catch (error) {
        return response.status(500).json({ msg: 'Error while signing up user' });
    }
    }
    else{
        return response.status(500).json({message: "Enter Correct Email Id", status: 500});
    }
} 

export const gloginUser = async(request,response) => {
    let user = await googleUser.findOne({sub:request.body.sub});
    if(!user){
        const user = { sub:request.body.sub ,email: request.body.email, name:request.body.name};
        const newUser = new googleUser(user);
        await newUser.save(); 
        try{
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m'});
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);
                
            const newToken = new Token({ token: refreshToken });
            await newToken.save();    
    
            return response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken,name: user.name, email: user.email });
            }catch(error){
                response.status(500).json({ msg: 'error while login the user' });       
            }   
    } else{
        try{
        const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m'});
        const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);
            
        const newToken = new Token({ token: refreshToken });
        await newToken.save();    

        return response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken,name: user.name, username: user.username });
        }catch(error){
            response.status(500).json({ msg: 'error while login the user' });       
        }
    }    
}

export const loginUser = async (request, response) => {
    let user = await User.findOne({ username: request.body.username });
    if (!user) {
        return response.status(400).json({ msg: 'Username does not match' });
    }

    try {
        let match = await bcrypt.compare(request.body.password, user.password);
        if (match) {
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m'});
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);
            
            const newToken = new Token({ token: refreshToken });
            await newToken.save();
        
            response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken,name: user.name, username: user.username });
        
        } else {
            response.status(400).json({ msg: 'Password does not match' })
        }
    } catch (error) {
        response.status(500).json({ msg: 'error while login the user' })
    }
}

export const logoutUser = async (request, response) => {
    const token = request.body.token;
    await Token.deleteOne({ token: token });

    response.status(204).json({ msg: 'logout successfull' });
}


export const forgotPassword = async(request, response) =>{
  let user = await User.findOne({ email: request.body.email });
    if (!user) {
      return response.status(400).json({ msg: 'Email does not match' });
    }
    try{
      let otpcode = Generator.generate({length: 6,numbers: true,expiresIn:300*1000});
      let otpdata = new Otp({
        email:request.body.email,
        code:otpcode,
        newPassword:await bcrypt.hash(request.body.newPassword, 10),
        expiresIn: new Date().getTime() + 300*1000,
      })
      await otpdata.save();
      mailer(request.body.email,otpcode);
    }catch(error){
      response.status(500).json({ msg: 'error while finding the user' })  
    }
}

export const resetPassword = async (request, response) => {
  try{
    let user = await Otp.findOne({ code: request.body.otpcode });
    if(!user){
      response.status(500);
    }   
    let existingUser = await User.findOne({email: user.email});
    await User.findByIdAndUpdate(
      {
        _id: existingUser.id,  
      },
      {
      $set:{
        password:user.newPassword,
      }
    });
    return response.status(200).json("Successfully changed");
  }catch(error){
    response.status(500);
  }
}
const mailer = (email,OTP) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "shubhangishrestha08@gmail.com",
      pass: process.env.MAIL_PASSWORD,
    },
  });
  var mailOptions = {
    from: "shubhangishrestha08@gmail.com",
    to: email,
    subject: "Password Reset",
    html:'<h3>Your One Time Password will be valid for 5minutes</h3>'+ OTP,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

  