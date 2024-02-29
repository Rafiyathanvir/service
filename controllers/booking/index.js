import express from 'express';
const bookingRoutes = express.Router();
import { db } from '../../db/database.js';
import { collections } from '../../db/collections.js';
import { GetBookingDetails } from '../../service/booking-service/booking-service.js';
import { returnRes } from '../../common/res.js';
import { tokenCheck } from '../../common/authorization.js';

bookingRoutes.post('/add-booking', async (req, res) => {
    try {
        const userInfo = await tokenCheck(req, res);
        console.log(userInfo)

        const { serviceInfo, arivaldate, requirement, bookingtype, address, timeing } = req.body;

        const _db = await db();
        const user = await _db.collection(collections.register).findOne({ email: userInfo?.user_id });
        if (!user) {
            return returnRes(res, false, "User not found", false, 400);
        }

        const bookingId = Math.floor(100000 + Math.random() * 900000);

        const result = await _db.collection(collections.booking).insertOne({
            userId: userInfo?.user_id,
            FullName: userInfo?.userName,
            Email: userInfo?.email,
            Phonenumber: userInfo?.number,
            bookingInfo: [{
                id: bookingId,
                title: serviceInfo.title,
                services: {
                    id: serviceInfo.id,
                    title: serviceInfo.title,
                    originalImageUrl: serviceInfo.image,
                    price: serviceInfo.price, 
                    discount: serviceInfo.discount, 
                },
                dates: arivaldate.date,
                address: address.address,
                requirement: requirement.requirement,
                bookingtype: bookingtype.bookingtype,
                timeing: timeing.timeing
            }]
        });

        return returnRes(res, true, "Booking added successfully", false);
    } catch (error) {
        console.log(error);
        return returnRes(res, false, error.response?.data ?? error.message, false, 400);
    }
});


bookingRoutes.get('/get-booking-list', async (req, res) => {
    try {
        const userInfo = await tokenCheck(req,res);
        const booking = await GetBookingDetails(userInfo?.user_id);

        return returnRes(res,true, "Get Booking List Successfully", booking ?? [])  
    
    } catch (error) {
        console.log(error)
        return returnRes(res,false,error.response.data,false,400)  
    }
})

export default bookingRoutes;
