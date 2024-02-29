import express from 'express';
const wishlistRoutes = express.Router();
import { collections } from '../../db/collections.js';
import { db } from '../../db/database.js';
import { GetWishListInfoByUserId, IsItemAlreadyInWishlist, RemoveFromWishlist } from '../../service/wishlist-service/index.js';


wishlistRoutes.post('/add-to-wishlist', async (req, res) => {
    try {
        const serviceIdd = parseInt(req.body.serviceId);
        const email = req.body.email;
        const isFavorite = req.body.isFavorite === true;


        const _db = await db();

        const user = await _db.collection(collections.register).findOne({ email: email });

        if (!user) {
            return res.status(404).json({
                isSuccess: false,
                message: "User not found",
            });
        }

        const isItemExist = await IsItemAlreadyInWishlist(email, serviceIdd);
        if (isItemExist) {
            return res.status(400).json({
                isSuccess: false,
                message: 'Item already added'
            });
        }

        const item = await _db.collection(collections.services).findOne({ serviceId: serviceIdd });
        if (!item) {
            return res.status(404).json({
                isSuccess: false,
                message: 'Service not found'
            });
        }

        const wishListInfo = await _db.collection(collections.wishlist).findOne({ email: email });

        if (wishListInfo != null) {
            await _db.collection(collections.wishlist).updateOne(
                { email: email },
                {
                    $push: {
                        activities: {
                            id: item.serviceId,
                            title: item.title,
                            description: item.description,
                            categoryId: item.categoryId,
                            category: item.category,
                            price: item.unitPrice,
                            discount: item.discountPrice,
                            image: item.image,
                            tag: item.tag,
                            rating: item.rating,
                            currency: item.currency, 
                            isFavorite: isFavorite 

                        }
                    }
                }
            );
        } else {
            await _db.collection(collections.wishlist).insertOne({
                email: email,
                activities: [{
                    id: item.serviceId,
                    title: item.title,
                    description: item.description,
                    categoryId: item.categoryId,
                    price: item.unitPrice,
                    discount: item.discountPrice,
                    image: item.image,
                    tag: item.tag,
                    rating: item.rating,
                    currency: item.currency,
                    isFavorite: isFavorite 

                }]
            });
        }

        return res.status(200).json({
            isSuccess: true,
            message: "Added to wishlist successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
});

wishlistRoutes.get('/get-wishlish-info', async (req, res) => {
    try {

        const email = req.query.email;

        const wishListInfo = await GetWishListInfoByUserId(email);

        return res.status(200).json({
            isSuccess: true,
            message: "Get Wishlist  Details Successfully",
            result: wishListInfo ?? []
        });



    } catch (error) {
        console.log(error)
    }
})


wishlistRoutes.post('/remove-from-wishlist', async (req, res) => {

    try {

        const email = req.query.email;
        const serviceId = parseInt(req.query.serviceId);

        await RemoveFromWishlist(email, serviceId);

        return res.status(200).json({
            isSuccess: true,
            message: "Item deleted successfully",
        });

    } catch (error) {
        console.log(error)
        return res.status(200).json({
            isSuccess: false,
            message: "Error deleting Item",
        });
    }



})


export default wishlistRoutes;