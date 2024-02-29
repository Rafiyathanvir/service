import express from 'express';
import { GetUserDetails } from '../../service/user-service/user-service.js';
import { tokenCheck } from '../../common/authorization.js';
import { returnRes } from '../../common/res.js';


const userInfoRoutes = express.Router();


userInfoRoutes.get('/getUserDetails', async (req, res) => {

    const userInfo = await tokenCheck(req,res);

    const GetUserInfo = await GetUserDetails(userInfo.user_id);

    return returnRes(res,true,"User Information", GetUserInfo)

});

export default userInfoRoutes;
