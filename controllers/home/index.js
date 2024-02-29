import express from "express";
import { GetAllCurrencyList, GetHomePageStaticSection, GetMostBookedServices, GetRecentBookedServices, GetServicesByPriceHighToLow, GetServicesByPriceLowToHigh, GetcategorySection, GetcategorySectionById, GetcategorySectionByTitle, GetserviceSection, GetserviceSectionById } from "../../service/home-service/home-service.js";

const homeRoutes = express.Router();



homeRoutes.get('/currencyList', async (req,res)=>{
  try {
     
      const currencyList = await GetAllCurrencyList();

      return res.status(200).json({ isSuccess: true, message: "Get CurrencyList Successfully", result: currencyList })

  } catch (error) {
      console.log(error)
  }
})

homeRoutes.get("/herosection", async (req, res) => {
  try {
    const homePageInfo = await GetHomePageStaticSection();
    res.status(200).json(homePageInfo);
  } catch (error) {
    console.log(error);
  }
});


homeRoutes.get("/category", async (req, res) => {
  try {
    const categoryInfo = await GetcategorySection();
    res.status(200).json(categoryInfo);
  } catch (error) {
    console.log(error);
  }
});

homeRoutes.get("/categoryTitle", async (req, res) => {
  try {
      let categoryTitle = req.query.categoryTitle;
  
      if ( categoryTitle.includes(',')) {
        categoryTitle = categoryTitle.split(',');
      }
    const categoryResults = await GetcategorySectionByTitle(categoryTitle);
    console.log("llll",categoryTitle,categoryResults);

    res.status(200).json(categoryResults);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" }); 
  }
});




homeRoutes.get("/priceLowToHigh/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const mappedSortedServices = await GetServicesByPriceLowToHigh(categoryId);
    res.status(200).json(mappedSortedServices);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


homeRoutes.get("/priceHighToLow/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const mappedSortedServices = await GetServicesByPriceHighToLow(categoryId);
    res.status(200).json(mappedSortedServices);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });

  }
});

homeRoutes.get("/services", async (req, res) => {
  try {
    const serviceInfo = await GetserviceSection();
    res.status(200).json(serviceInfo);
  } catch (error) {
    console.log(error);
  }
});

homeRoutes.get("/categoryById", async (req, res) => {
  try {
    const categoryId = req.query.id; 
    console.log("Category ID:", categoryId); 


    const services = await GetcategorySectionById(categoryId);

    res.status(200).json(services);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

homeRoutes.get("/serviceById", async (req, res) => {
  try {
    const serviceId= req.query.id; 
    console.log("service ID:", serviceId); 


    const services = await GetserviceSectionById(serviceId);

    res.status(200).json(services);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


homeRoutes.get("/mostbookedservice", async (req, res) => {
  try {
    const MostBookedServices = await GetMostBookedServices();
    res.status(200).json(MostBookedServices);
  } catch (error) {
    console.log(error);
  }
});

homeRoutes.get("/recentbookedservice", async (req, res) => {
  try {
    const recentServices = await GetRecentBookedServices();
    res.status(200).json(recentServices);
  } catch (error) {
    console.log(error);
  }
});



export default homeRoutes;