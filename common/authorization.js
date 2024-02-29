import jwt from 'jsonwebtoken';
import { returnRes } from './res.js';

// export async function tokenCheck(req, res) {
//     if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
//         return false;
//     }
//     const theToken = req.headers.authorization.split(' ')[1];
//     const decoded = jwt.verify(theToken, process.env.JWT_KEY);
//     return decoded;
// }



export async function tokenCheck(req, res) {
    let tokenObject = {};
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
            return returnRes(res,false,"UnAuthorized Access",401)
        }else{
            const token = req.headers.authorization.split(' ')[1];
            if(token){
                const JwtDecode = jwt.decode(token);

console.log("lll",JwtDecode)
                if (JwtDecode) {
                    const { email, FullName, number} = JwtDecode;
                    
                    tokenObject = {
                        user_id: email,
                        userName: FullName,
                        number:number,
                        email:email
                    };
                }
            }
            return tokenObject;
        }
    } catch (error) { 
        return returnRes(res,false,error.response.data,400)
    }
}

