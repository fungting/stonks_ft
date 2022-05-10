import yahooFinance from "yahoo-finance2";
import { knex } from "./db";
import { makeMap } from "./helper";

getYahooFinanceData();

async function getYahooFinanceData() {
	let stockArr = await knex("stocks").select("ticker", "id");
	let stockMap = stockArr.reduce(makeMap, {});
	let tickerArr = stockArr.map((e) => e["ticker"]);
	let fields: any[] = ["regularMarketPrice"];
	let stockData = [];
	// let date = Date.now();
	console.log(`${new Date().toISOString()} downloading stock data`);

	for (let ticker of tickerArr) {
		let obj = {};
		try {
			let result = await yahooFinance.quoteCombine(ticker, { fields });
			obj["stock_id"] = stockMap[ticker];
			obj["price"] = result["regularMarketPrice"];
			stockData.push(obj);
		} catch (error) {
			console.log("error", error);
		}
	}
	await knex("stock_prices").insert(stockData);
	console.log(`${new Date().toISOString()} inserted ${stockData.length} rows data`);
	knex.destroy();
}
