import { collections } from '../../db/collections.js';
import { db } from '../../db/database.js';


export async function IsItemAlreadyInWishlist(email, serviceId) {
    const _db = await db();
    let filter = { email: email, "activities.id": serviceId }; 
    const foundItem = await _db
        .collection(collections.wishlist)
        .findOne(filter);
    return foundItem != null;
}



  
export async function RemoveFromWishlist(email,serviceId){

    const _db = await db();

    await _db.collection(collections.wishlist).updateOne(
        {email:email},
        { $pull: { activities: { id: serviceId } } }
    )

    await _db.collection(collections.wishlist).deleteOne({ $and: [ {email:email}, { activities: { $size: 0 } }] });

}





async function getWishListInfoByUserId(email){

    const _db = await db();

    const wishlistDetails = await _db.collection(collections.wishlist).findOne({email:email});

    return wishlistDetails;

}
export async function GetWishListInfoByUserId(email){

    try {

        const wishlistInfo = await getWishListInfoByUserId(email);

        const wishlistProduct = await wishlistInfo.activities.map((list)=>({
                id:list.id,
                title:list.title,
                imageUrl:list.imageUrl,
                country:list.country,
                rating:list.rating,
                review:list.review,
                amount:list.amount,
                currency:list.currency
        }));

        return wishlistProduct
       

    } catch (error) {
        console.log(error)
    }




}