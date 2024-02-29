
import { collections } from '../../db/collections.js';
import {db} from '../../db/database.js'

async function getUserDetails(user_id){

    const _db = await db();
    const result = await _db.collection(collections.register).findOne({email:user_id});
    return result;
}

export async function GetUserDetails(user_id){

    try {
        const userInfo = await getUserDetails(user_id)

        let ret ={
            user_id : userInfo.email,
            userName : userInfo.FullName,
            phoneNumer:userInfo.number,
            email:userInfo.email

        }
        return ret;
        
    } catch (error) {
        console.log(error)
        
    }
}