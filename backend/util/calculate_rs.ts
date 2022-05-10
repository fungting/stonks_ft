import Knex from "knex";
import knexConfigs from "../knexfile";
import env from "./env";

const knex = Knex(knexConfigs[env.NODE_ENV]);

async function init() {
	await knex.raw(`REFRESH MATERIALIZED VIEW stock_historic_prices`);
	await calculateRs();
	await knex.raw(`REFRESH MATERIALIZED VIEW industry_rs_view`);
	await industryRs();
	await knex.raw(`REFRESH MATERIALIZED VIEW screeners`);
	knex.destroy();
}

init();

async function calculateRs() {
	let stockArr: StockPrice[] = await knex.select("*").from("stock_historic_prices");

	let russel: StockPrice = (await knex.select("*").from("stock_historic_prices").where("ticker", "IWV"))[0];

	const russelPerf = performance(russel);

	console.log(russelPerf);

	let stockRsArr = [];

	for (let stock of stockArr) {
		let obj: StockRS = {
			date_id: 0,
			stock_id: 0,
			off_year_high: 0,
			relative_strength: 0,
		};

		let stockPerf = performance(stock);
		obj.date_id = stock.date_id;
		obj.stock_id = stock.stock_id;
		obj.relative_strength = Number(percentChg(stockPerf, russelPerf).toFixed(2));
		obj.off_year_high = -Number(percentChg(stock.price1, stock.year_high).toFixed(2));
		stockRsArr.push(obj);
	}

	// console.log(stockRsArr);

	await knex("temp_stock_rs").del()

	await knex.insert(stockRsArr).into("temp_stock_rs");

	let resultArr = (
		await knex.raw(
			/*sql*/
			`select stock_id, date_id,
			round(percent_rank() OVER (
			ORDER BY relative_strength) * 100) as rs_rating
			from temp_stock_rs
			order by stock_id`
		)
	).rows;

	console.log(resultArr[0]);

	await knex.insert(resultArr).into("stock_rs");
}

async function industryRs() {
	console.log("start calculating industry rs");

	let industryRsArr: inductryRS[] = (
		await knex.raw(
			/*sql*/
		`select date_id, id as "industry_id",
		round(industry_rs) as "rs_rating",
		rank () over (
		order by industry_rs desc) as "ranking"
		from industry_rs_view
		order by id`
		)
	).rows;

	await knex.insert(industryRsArr).into("industry_rs");
	console.log("finish calculating industry rs");
}

function percentChg(now: number, before: number) {
	return ((now - before) / Math.abs(before)) * 100;
}

function performance(stock: StockPrice) {
	let perf: any[] = [];
	for (let i = 0; i < 5; i++) {
		if (stock[`price${i + 2}`]) {
			perf[i] = percentChg(stock.price1, stock[`price${i + 2}`]);
		} else {
			perf[i] = perf[i - 1];
		}
	}
	return 0.15 * perf[0] + 0.25 * perf[1] + 0.2 * perf[2] + 0.2 * perf[3] + 0.2 * perf[4];
}

type StockPrice = {
	date_id: number;
	stock_id: number;
	ticker: string;
	year_high: number;
	price1: number;
	price2: number;
	price3: number;
	price4: number;
	price5: number;
	price6: number;
};

type StockRS = {
	date_id: number;
	stock_id: number;
	off_year_high: number;
	relative_strength?: number;
	rs_rating?: number;
};

type inductryRS = {
	date_id: number;
	industry_id: number;
	rs_rating: number;
	ranking: number;
}