import express from "express";
import { getExchangeRate } from "../../service/currency-service/currency-service.js";
const currencyRoutes = express.Router();

currencyRoutes.post("/set-currency", async (req, res) => {
  try {
    const currency = req.body?.currency ?? "USD";

    const currencyRate = await getExchangeRate(currency);

    const curObj = {
      currency: currency,
      currencyRate: currencyRate,
    };

    return res
      .status(200)
      .json({
        isSuccess: true,
        message: "Get CurrencyValue Successfully",
        result: curObj,
      });
  } catch (error) {
    console.log(error);
  }});
export default currencyRoutes;
