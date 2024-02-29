import { collections } from '../../db/collections.js';
import {db} from '../../db/database.js'

// Get Home page Static Information from Database

export async function GetAllCurrencyList(){

    const _db = await db();

    const currency = await _db.collection(collections.currency).aggregate(
        [
        //    {
        //  $match:{
        //      $and:[
        //              {payment:true},
        //             {code:{$in:["USD","INR"]}}
        //         ]
        //     }
        //    },
           {
            $project :{code:1}
           }
        ]
    ).toArray();
    const ret = [ ...currency.map(a=>a.code)];
    return ret;
}



async function getHomePageStaticSection(){

    const _db = await db();

    const homeInfo = await _db.collection(collections.pages).findOne({pageId:"home"});

    return {
        pageId: homeInfo?.pageId,
        pageTitle: homeInfo?.pageTitle,
        staticSection: homeInfo?.staticSection,
      };
}

export async function GetHomePageStaticSection(){

    try {
        const homePageInfo = await getHomePageStaticSection();
        return homePageInfo;
    } catch (error) {
        console.log(error)
    }
}

// Get service Information from Database

async function getserviceSection(){

    const _db = await db();

    const serviceInfo = await _db.collection(collections.services).find({}).toArray();

    return serviceInfo;
}


export async function GetserviceSection(){

    try {
        const serviceInfo = (await getserviceSection()).map((service)=>({
            id:service.serviceId ?? '',
            title : service.title ?? '',
            description:service.description ?? '',
            categoryId: service.categoryId ?? '',
            category: service.categoryTitle ?? '',
            price: service.unitPrice ?? '',
            discount: service.discountPrice ?? '',  
            image: Array.isArray(service.image) && service.image.length > 0 ? service.image[0] : '',

            tag: service.itemTags ?? '', 
            rating: service.rating ?? '', 
            address: service.address ?? '',
            reviews: Array.isArray(service.reviews) && service.reviews.length > 0 ? service.reviews[0] : '',
            services: Array.isArray(service.services) && service.services.length > 0 ? service.services[0] : '',
            timings: Array.isArray(service.timings) && service.timings.length > 0 ? service.timings[0] : '',
            currency: service.currency ?? '' 

        }));
        return serviceInfo;
    } catch (error) {
        console.log(error)
    }
}



// Get Most Booked service Information from Database


async function getMostBookedServices(){

    const _db = await db();

    const serviceInfo = await _db.collection(collections.services).aggregate([
        {
            $match:{
                $and:[
                    {itemTags:"Most Booked"},
                    {status:"active"}
                ]
            }
        }
    ]).toArray();
    

    return serviceInfo;
}


export async function GetMostBookedServices() {
    try {
        const serviceInfo = (await getMostBookedServices()).map((service) => ({
            id: service.serviceId ?? '',
            title: service.title ?? '',
            description: service.description ?? '',
            categoryId: service.categoryId ?? '',
            category: service.categoryTitle ?? '',
            price: service.unitPrice ?? '',
            discount: service.discountPrice ?? '',
            image: service.image[0] ?? '',
            tag: service.itemTags ?? '',
            rating: service.rating ?? '',
            address: service.address ?? '',
            reviews: service.reviews[0]?? '',
            services: service.services[0]?? '',
            timings: service.timings[0]?? '',
            currency: service.currency ?? 'INR' 


        }));


        return serviceInfo;
    } catch (error) {
        console.log(error);
    }
}




// Get Recent Booked service Information from Database


async function getRecentBookedServices(){

    const _db = await db();

    const serviceInfo = await _db.collection(collections.services).aggregate([
            {
            $match:{
                $and:[
                    {itemTags:"Recent Booked"},
                    {status:"active"}
                ]
            }
        }
    ]).toArray();

    return serviceInfo;
}


export async function GetRecentBookedServices() {
    try {
        const serviceInfo = (await getRecentBookedServices()).map((service) => ({
            id: service.serviceId ?? '',
            title: service.title ?? '',
            description: service.description ?? '',
            categoryId: service.categoryId ?? '',
            category: service.categoryTitle ?? '',
            price: service.unitPrice ?? '',
            discount: service.discountPrice ?? '',
            image:service.image[0] ?? '',
            tag: service.itemTags   ?? '',
            rating: service.rating ?? '',
            address: service.address ?? '',
            reviews: service.reviews[0]?? '',
            services: service.services[0]?? '',
            timings: service.timings[0]?? '',
            currency: service.currency ?? '' 


        }));

        // const featureServices = serviceInfo.filter((service) =>
        //     service.tag.includes('featuredAds')
        // );

        return serviceInfo;
    } catch (error) {
        console.log(error);
    }
}


// GET Category Section From Database


async function getcategorySection(){

    const _db = await db();

    const categoryInfo = await _db.collection(collections.category).find({}).toArray();

    return categoryInfo;
}

async function getNumberOfServicesInCategory(categoryId) {
    const _db = await db();

    const numberOfServices = await _db.collection(collections.services).aggregate(
        [ { $match : { categoryId : categoryId } } ]
    ).toArray();

    return numberOfServices;
}

export async function GetcategorySection(){

    try {
        const categories = await getcategorySection();

        const categoryInfo = [];

        for (const category of categories) {
            const count = await getNumberOfServicesInCategory(category.categoryId);

            categoryInfo.push({
                id: category.categoryId ?? '',
                image: category.logoImage ?? '',
                title: category.categoryTitle ?? '',
                count: count.length ?? 0
            });
        }

        return categoryInfo;
    } catch (error) {
        console.log(error);
    }
}


// Get services by categoryId

async function getcategorySectionById(categoryId) {
    // const _db = await db();
    // const serviceInfo = await _db.collection(collections.services).find({ categoryId: categoryId }).toArray();
    // return serviceInfo;


    try {
        const _db = await db();
        let serviceInfo;

        if (categoryId === 'All') {
            serviceInfo = await _db.collection(collections.services).find({}).toArray();
        } 
         else {
            serviceInfo = await _db.collection(collections.services)
                .find({ categoryId: categoryId })
                .toArray();
        }

        return serviceInfo; 
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function GetcategorySectionById(categoryId) {
    try {
        const serviceInfo = (await getcategorySectionById(categoryId)).map((service) => ({
            id: service.serviceId ?? '',
            title: service.title ?? '',
            description: service.description ?? '',
            categoryId: service.categoryId ?? '',
            category: service.categoryTitle ?? '',
            price: service.unitPrice ?? '',
            discount: service.discountPrice ?? '',
            image: Array.isArray(service.image) && service.image.length > 0 ? service.image[0] : '', 
            tag: service.itemTags ?? '',
            rating: service.rating ?? '', 
            currency: service.currency ?? '' 

   
        }));
        return serviceInfo;
    } catch (error) {
        console.log(error);
    }
}




//....................... Get Category  by category Title 


async function getServicesByCategoryTitle(categoryTitle) {
    try {
        const _db = await db();
        let serviceInfo;

        if (categoryTitle === 'All') {
            serviceInfo = await _db.collection(collections.services).find({}).toArray();
        } else if (Array.isArray(categoryTitle)) {
            serviceInfo = await _db.collection(collections.services)
                .find({ categoryTitle: { $in: categoryTitle } })
                .toArray();
        } else {
            serviceInfo = await _db.collection(collections.services)
                .find({ categoryTitle: categoryTitle })
                .toArray();
        }

        return serviceInfo; 
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function GetcategorySectionByTitle(categoryTitle) {
    try {
        const serviceInfo = await getServicesByCategoryTitle(categoryTitle);
        return serviceInfo.map(service => ({
            id: service.serviceId ?? '',
            title: service.title ?? '',
            description: service.description ?? '',
            categoryId: service.categoryId ?? '',
            category: service.categoryTitle ?? '',
            price: service.unitPrice ?? '',
            discount: service.discountPrice ?? '',
            image: Array.isArray(service.image) && service.image.length > 0 ? service.image[0] : '', 
            tag: service.itemTags ?? '',
            rating: service.rating ?? '', 
            currency: service.currency ?? '' 
       
     
        }));
   
    } catch (error) {
        console.error(error);
        throw error;
    }
}




// get service by serviceId

async function getserviceSectionById(serviceId) {
    const _db = await db();
    const serviceIdd = parseInt(serviceId);
    const serviceInfo = await _db.collection(collections.services).findOne({ serviceId: serviceIdd });
    console.log("ggg", serviceInfo);
    return serviceInfo;
}

export async function GetserviceSectionById(serviceId) {
    try {
        // console.log("ww", serviceId);
        const serviceInfo = await getserviceSectionById(serviceId); 
        // console.log("dd", serviceInfo);
        
        if (!serviceInfo) {
            return []; 
        }

        const mappedServiceInfo = [{
            id: serviceInfo.serviceId ?? '',
            title: serviceInfo.title ?? '',
            description: serviceInfo.description ?? '',
            categoryId: serviceInfo.categoryId ?? '',
            category: serviceInfo.categoryTitle ?? '',
            price: serviceInfo.unitPrice ?? '',
            discount: serviceInfo.discountPrice ?? '',
            image: serviceInfo.image[0] ?? '',
            tag: serviceInfo.itemTags ?? '',
            rating: serviceInfo.rating ?? '',   
            currency: serviceInfo.currency ?? '' 

        }];

        return mappedServiceInfo;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function GetServicesByPriceLowToHigh(categoryId) {
    try {
        const services = await  getcategorySectionById(categoryId); 

        const sortedServices = services.sort((a, b) => a.unitPrice - b.unitPrice);

        const mappedSortedServices = sortedServices.map(service => ({
            id: service.serviceId ?? '',
            title: service.title ?? '',
            description: service.description ?? '',
            categoryId: service.categoryId ?? '',
            category: service.categoryTitle ?? '',
            price: service.unitPrice ?? '',
            discount: service.discountPrice ?? '',
            image: service.image[0] ?? '',
            tag: service.itemTags ?? '',
            rating: service.rating ?? '',
            currency: service.currency ?? ''
        }));

        return mappedSortedServices;
    } catch (error) {
        console.log(error);
        throw error;
    }
}



export async function GetServicesByPriceHighToLow(categoryId) {
    try {
        const services = await  getcategorySectionById(categoryId); 

        const sortedServices = services.sort((a, b) => b.unitPrice - a.unitPrice);

        const mappedSortedServices = sortedServices.map(service => ({
            id: service.serviceId ?? '',
            title: service.title ?? '',
            description: service.description ?? '',
            categoryId: service.categoryId ?? '',
            category: service.categoryTitle ?? '',
            price: service.unitPrice ?? '',
            discount: service.discountPrice ?? '',
            image: service.image[0] ?? '',
            tag: service.itemTags ?? '',
            rating: service.rating ?? '',
            currency: service.currency ?? ''
        }));

        return mappedSortedServices;
    } catch (error) {
        console.log(error);
        throw error;
    }
}