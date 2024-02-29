import { db } from "../../db/database.js";
import { collections } from "../../db/collections.js";

export async function getExchangeRate(currency) {
  if (currency === "USD") {
    return 1; 
  }

  const _db = await db();
  const currencyExcRateArr = await _db
    .collection(collections.currency)
    .aggregate([
      {
        $match: {
          code: currency,
        },
      },
      {
        $project: {
          conversionRate: "$rate", 
        },
      },
    ])
    .toArray();

  if (currencyExcRateArr.length > 0) {
    const conversionRate = currencyExcRateArr[0].conversionRate * (await getExchangeRate("USD"));
    return Math.round(conversionRate); 
  } else {
    return 1; 
  }
}
