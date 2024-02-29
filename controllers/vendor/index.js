import express from "express";
import bcyrpt from "bcryptjs";
import passwordValidator from "password-validator";
import validator from "validator";
// import jwt from "jsonwebtoken";
import { db } from "../../db/database.js";
import { collections } from "../../db/collections.js";
import { returnRes } from "../../common/res.js";
import nodemailer from 'nodemailer';

const vendorRoutes = express.Router();



const pwdSchema = new passwordValidator();

pwdSchema
  .is().min(8, "Password should have a minimum length of 8 characters")                                    // Minimum length 8
  .is().max(50, "Password should have a minimum length of 50 characters")                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits(1)                                 // Must have at least 1 symbols
  .has().symbols(1)                                // Must have at least 1 symbols
  .has().not().spaces()                           // Should not have spaces


var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "rafiyathanvir@gmail.com",
    pass: "mcam xyfs rucg soyb"
  }
});

function randomToken() {
  const len = 8;
  let randTok = ''
  for (let i=0;i<len;i++){
    const ch = Math.floor((Math.random() * 100) + 54);
    randTok += ch;
  }

  return randTok;
}

async function sendEmailRegistration(req, randomToken) 
{
  let link = "http://" + req.get('host') + "/api/vendor/verify/" + randomToken;

  let info = await smtpTransport.sendMail({
    to: req.body.email,
    subject: "Please confirm your Email account",
    html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
  });
}


vendorRoutes.post("/register", async (req, res) => {
  const _db = await db();
  try {
    const { name, email, number, password, confirmPassword } = req.body;
    if (!validator.isEmail(email)) {
      return returnRes(
        res,
        false,
        "Please enter valid Email address",
        false,
        400
      );
    }

    if (password != confirmPassword) {
      return returnRes(res, false, "Password do not match", false, 400);
    }

    var passwordValidate = pwdSchema.validate(password, { details: true });
    if (passwordValidate != null && passwordValidate.length > 0) {
      const pwdResMsg = passwordValidate.map((p) => p.message).join(", ");
      return returnRes(res, false, pwdResMsg, 400);
    }


    
    const userExists = await _db.collection(collections.register).findOne({ email: email });
    if (userExists) {
      return returnRes(res, false, "Email is already registered as user", false, 400);
    }


    const user = await _db
      .collection(collections.vendor)
      .findOne({ email: email });
    if (user) {
      return returnRes(res, false, "Email already Registered in vendor!", false, 400);
    }
    const hashPassword = await bcyrpt.hash(password, 10);
    let rand = randomToken();

    const newVendor = {
      name: name,
      number: number,
      email: email,
      password: hashPassword,
      userToken: rand,
      confirmed: false,
    };

    await _db.collection(collections.vendor).insertOne(newVendor);

    await sendEmailRegistration(req, rand);

    return returnRes(res, true, "Vendor Registered SuccessFully");
  } catch (error) {
    console.log(error);
    return returnRes(res, false, error, false, 400);
  }
});

vendorRoutes.get("/verify/:userToken", async (req, res) => {
  const _db = await db();
  const userToken = req.params.userToken;
  const user = await _db.collection(collections.vendor).findOne({ userToken: userToken });

  if (user) {
    try {
      await _db.collection(collections.vendor).updateOne(
         { "userToken" : userToken },
         { $set: { "confirmed" : true } }
      );
   } catch (e) {
    console.log(e);
    return returnRes(res, false, e, false, 400);
   }

   //need to enter vendor dashboard address here
   res.redirect('http://localhost:3000/complete-profile');
  }else{
    return returnRes(res, false, "User does not exist", false, 400);
  }
})


export default vendorRoutes;
