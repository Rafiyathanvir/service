
// import tokenAuthenticate from "../common/config.js";
// import { GetUserDetails } from "../service/user-service/user-service.js";
import express from 'express';
import bcrypt from "bcryptjs"
import passwordValidator from 'password-validator';
import validator from 'validator';
import jwt from 'jsonwebtoken';
// import axios from 'axios';
const userRoutes = express.Router();
import { db } from '../../db/database.js';
import { collections } from '../../db/collections.js';

import { returnRes } from '../../common/res.js';

import nodemailer from 'nodemailer';
import crypto from 'crypto';

const pwdSchema = new passwordValidator();

pwdSchema
  .is().min(8, "Password should have a minimum length of 8 characters")                                    // Minimum length 8
  .is().max(50, "Password should have a minimum length of 50 characters")                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits(1)                                 // Must have at least 1 symbols
  .has().symbols(1)                                // Must have at least 1 symbols
  .has().not().spaces()                           // Should not have spaces
  .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values





  // .......................User Register...................................


userRoutes.post('/register', async (req, res) => {

  const _db = await db();
  try {
    const { FullName, number, email, createPassword, confirmPassword } = req.body;
    if (!validator.isEmail(email)) {
      return returnRes(res, false, "Please enter valid Email address", false, 400)
    }
    if (createPassword != confirmPassword) {
      return returnRes(res, false, "Password do not match", false, 400)
    }

    var passwordValidate = pwdSchema.validate(createPassword, { details: true })

    if (passwordValidate != null && passwordValidate.length > 0) {
      const pwdResMsg = passwordValidate.map((p) => p.message).join(', ');
      return returnRes(res, false, pwdResMsg, 400)
    }

    const user = await _db.collection(collections.register).findOne({ email: email });
    if (user) {
      return returnRes(res, false, "user already Registered!", false, 400)
    }
    const hashPassword = await bcrypt.hash(createPassword, 10);

    const newRegisterUser = {
      FullName: FullName,
      number: number,
      email: email,
      password: hashPassword
    }

    await _db.collection(collections.register).insertOne(newRegisterUser);
    return returnRes(res, true, "User Registered SuccessFully")

  } catch (error) {
    console.log(error);
    return returnRes(res, false, error.response.data, false, 400)
  }
})


// ....................... User Login...................................



userRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return returnRes(res, false, "Email and password are required", false, 400);
    }

    const _db = await db();
    const userInfo = await _db.collection(collections.register).findOne({ email: email });

    if (!userInfo) {
      return returnRes(res, false, "User does not exist", false, 400);
    }

    const isPasswordValid = bcrypt.compareSync(password, userInfo.password);

    if (!isPasswordValid) {
      return returnRes(res, false, "Invalid credentials", false, 400);
    }

    const user = {
      FullName: userInfo.FullName,
      number: userInfo.number,
      email: userInfo.email,
      isLoggedIn: true,
    };

    const jwtToken = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '90d' });

    return returnRes(res, true, "User Login Successfully", { token: jwtToken });
  } catch (error) {
    console.error(error);
    return returnRes(res, false, "Internal Server Error", false, 500);
  }
});


// .......................User Forgot Password...................................






async function sendResetEmail(email, token) {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'rafiyathanvir@gmail.com', 
      pass: 'mcam xyfs rucg soyb'
    }
  });

  let info = await transporter.sendMail({
    from: 'rafiyathanvir@gmail.com', 
    to: email,
    subject: 'Password Reset', 
    text: `Click the following link to reset your password: http://localhost:3000/resetpassword?token=${token}` 
  });

  console.log('Message sent: %s', info.messageId);
}

userRoutes.post('/resetpassword', async (req, res) => {
  try {
    const { email } = req.body;

    const _db = await db();
    const user = await _db.collection(collections.register).findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Email address not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; 

    await _db.collection(collections.register).updateOne(
      { email },
      { 
        $set: { 
          resetToken, 
          resetTokenExpires 
        } 
      }
    );

    await sendResetEmail(email, resetToken);

    return res.status(200).json({ success: true, message: 'Password reset link sent successfully' });

  } catch (error) {
    console.error('Error sending password reset email:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});   

userRoutes.post('/resetpasswordd', async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const _db = await db();
    const user = await _db.collection(collections.register).findOne({ resetToken: token });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    if (user.resetTokenExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Reset token has expired' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    await _db.collection(collections.register).updateOne(
      { resetToken: token },
      { 
        $set: { 
          password: hashedPassword, 
          resetToken: null,
          resetTokenExpires: null
        } 
      }
    );

    return res.status(200).json({ success: true, message: 'Password reset successful' });

  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});





//........................Change Password.................


userRoutes.post('/changePassword', async (req, res) => {
  try {
    const { email } = req.query;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!validator.isEmail(email)) {
      return returnRes(res, false, "Please enter a valid email address", false, 400);
    }

    if (currentPassword === newPassword) {
      return returnRes(res, false, "New password must be different from the current password", false, 400);
    }
    
    if (newPassword !== confirmPassword) {
      return returnRes(res, false, "Passwords do not match", false, 400);
    }

    const _db = await db();
    const user = await _db.collection(collections.register).findOne({ email: email });
    if (!user) {
      return returnRes(res, false, "User not found", false, 404);
    }
    const passwordMatch =  bcrypt.compareSync(currentPassword, user.password);

    if (!passwordMatch) {
      return returnRes(res, false, "Current password is incorrect", false, 400);
    }

    const hashPassword =  bcrypt.hashSync(newPassword, 10);

    const result = await _db.collection(collections.register).updateOne({ email: email }, { $set: { password: hashPassword } });

    if (result.modifiedCount === 0) {
      return returnRes(res, false, "Failed to update password", false, 500);
    }

    return returnRes(res, true, "Password updated successfully");
  } catch (error) {
    console.error("error", error);
    return returnRes(res, false, "Internal Server Error", false, 500);
  }
});







export default userRoutes;




