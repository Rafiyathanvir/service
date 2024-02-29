import { db } from '../../db/database.js';
import { collections } from '../../db/collections.js';

async function getBookingDetails(userId){

    const _db = await db();

    const cartDetails = await _db.collection(collections.booking).findOne({userId:userId});

    return cartDetails;

}
export async function GetBookingDetails(userId){

    try {
        const bookingInfo = await getBookingDetails(userId);

        return bookingInfo; 

        

    } catch (error) {
        console.log(error)
        throw error; 

    }

}
