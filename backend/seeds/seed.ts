import { Knex } from "knex";
import xlsx from "xlsx";
import { hashPassword } from "../util/hash";
//@ts-ignore
import { logger } from "../util/logger";
import {
	Industry,
	RawIndustryData,
	RawStockData,
	Sector,
	SectorData,
	StockData,
	UserData,
	UserComment,
	PortfolioData,
	IndustryData,
} from "../util/models";

export async function seed(knex: Knex): Promise<void> {
	let workbook = xlsx.readFile("./seeds/new_data.xlsx");
	let sectorData: SectorData[] = xlsx.utils.sheet_to_json(workbook.Sheets["sectors"]);
	let rawIndustryData: RawIndustryData[] = xlsx.utils.sheet_to_json(workbook.Sheets["industries"]);
	let rawStockData: RawStockData[] = xlsx.utils.sheet_to_json(workbook.Sheets["stocks"]);
	let userData: UserData[] = xlsx.utils.sheet_to_json(workbook.Sheets["users"]);
	let portfolioData: PortfolioData[] = xlsx.utils.sheet_to_json(workbook.Sheets["portfolios"]);
	let commentData: UserComment[] = xlsx.utils.sheet_to_json(workbook.Sheets["comments"]);
	let watchlistData = xlsx.utils.sheet_to_json(workbook.Sheets["watchlists"]);
	let watchlistStockData = xlsx.utils.sheet_to_json(workbook.Sheets["watchlistStock"]);
	let marketCaps = xlsx.utils.sheet_to_json(workbook.Sheets["stock_market_caps"]);
	let sentimentData = xlsx.utils.sheet_to_json(workbook.Sheets["sentiments"]);
	let countryData = xlsx.utils.sheet_to_json(workbook.Sheets["countries"]);
	let indicatorData = xlsx.utils.sheet_to_json(workbook.Sheets["indicators"]);
	let maturityPeriodData = xlsx.utils.sheet_to_json(workbook.Sheets["maturity_periods"]);
	let yearQuarterData = xlsx.utils.sheet_to_json(workbook.Sheets["year_quarters"]);

	//for getting back-up data only
	// let backups = xlsx.readFile("./seeds/backup/indicators_backup.xlsx");
	// let economicBackup =  xlsx.utils.sheet_to_json(backups.Sheets["economic"]);
	// let sentimentBackup = xlsx.utils.sheet_to_json(backups.Sheets["sentiment"]);
	// let ratesBackup: any = xlsx.utils.sheet_to_json(backups.Sheets["rates"]);

	for (let user of userData) {
		user.password = await hashPassword(user.password!.toString());
	}

	let txn = await knex.transaction();
	try {
		// Deletes ALL existing entries
		await txn("staging_stock_prices").del();
		await txn.raw(`ALTER SEQUENCE staging_stock_prices_id_seq RESTART`);

		await txn("treasury_rates").del();
		await txn.raw(`ALTER SEQUENCE treasury_rates_id_seq RESTART`);
		
		await txn("economic_indicators").del();
		await txn.raw(`ALTER SEQUENCE economic_indicators_id_seq RESTART`);

		await txn("sentiment_indicators").del();
		await txn.raw(`ALTER SEQUENCE sentiment_indicators_id_seq RESTART`);

		await txn("stock_earnings").del();
		await txn.raw(`ALTER SEQUENCE stock_earnings_id_seq RESTART`);

		await txn("stock_market_caps").del();
		await txn.raw(`ALTER SEQUENCE stock_market_caps_id_seq RESTART`);
		
		await txn("watchlist_stock").del();
		await txn.raw(`ALTER SEQUENCE watchlist_stock_id_seq RESTART`);
		
		await txn("industry_rs").del();
		await txn.raw(`ALTER SEQUENCE industry_rs_id_seq RESTART`);
		
		await txn("stock_rs").del();
		await txn.raw(`ALTER SEQUENCE stock_rs_id_seq RESTART`);
		
		await txn("watchlists").del();
		await txn.raw(`ALTER SEQUENCE watchlists_id_seq RESTART`);
		
		await txn("stock_prices").del();
		await txn.raw(`ALTER SEQUENCE stock_prices_id_seq RESTART`);
		
		await txn("dim_dates").del();
		await txn.raw(`ALTER SEQUENCE dim_dates_id_seq RESTART`);

		await txn("dim_sentiments").del();
		await txn.raw(`ALTER SEQUENCE dim_sentiments_id_seq RESTART`);

		await txn("dim_countries").del();
		await txn.raw(`ALTER SEQUENCE dim_countries_id_seq RESTART`);

		await txn("dim_indicators").del();
		await txn.raw(`ALTER SEQUENCE dim_indicators_id_seq RESTART`);

		await txn("dim_maturity_periods").del();
		await txn.raw(`ALTER SEQUENCE dim_maturity_periods_id_seq RESTART`);

		await txn("dim_year_quarters").del();
		await txn.raw(`ALTER SEQUENCE dim_year_quarters_id_seq RESTART`);

		await txn("portfolios").del();
		await txn.raw(`ALTER SEQUENCE portfolios_id_seq RESTART`);

		await txn("comments").del();
		await txn.raw(`ALTER SEQUENCE comments_id_seq RESTART`);

		await txn("user_history").del();
		await txn.raw(`ALTER SEQUENCE user_history_id_seq RESTART`);

		await txn("users").del();
		await txn.raw(`ALTER SEQUENCE users_id_seq RESTART`);

		await txn("stocks").del();
		await txn.raw(`ALTER SEQUENCE stocks_id_seq RESTART`);

		await txn("industries").del();
		await txn.raw(`ALTER SEQUENCE industries_id_seq RESTART`);

		await txn("sectors").del();
		await txn.raw(`ALTER SEQUENCE sectors_id_seq RESTART`);

		// Inserts seed entries
		const sectorArr: Sector[] = await txn("sectors").insert(sectorData).returning(["id", "name"]);
		const sectorMap = sectorArr.reduce(makeMap, {});
		let industryData: IndustryData[] = rawIndustryData.map((row): IndustryData => {
			let { sector, ...industryObj } = row;
			industryObj["sector_id"] = sectorMap[sector];
			return industryObj;
		});

		const industryIDs: Industry[] = await txn("industries")
			.insert(industryData)
			.returning(["id", "name", "sector_id"]);
		let stockData: StockData[] = [];
		for (let stock of rawStockData) {
			for (let industry of industryIDs) {
				if (stock.industry_name == industry.name) {
					stock.industry_id = industry.id;
					stock.sector_id = industry.sector_id;
				}
			}
			let { industry_name, ...formattedStock } = stock;
			stockData.push(formattedStock);
		}
		let stockArr = await txn("stocks").insert(stockData).returning(["id", "ticker"]);
		//@ts-ignore
		let stockMap = stockArr.reduce(makeMap, {});

		let marketCapsData = marketCaps.map((row: any) => {
			let {ticker, ...marketCapObj} = row;
			marketCapObj["stock_id"] = stockMap[ticker]
			return marketCapObj;
		})
		
		await txn("stock_market_caps").insert(marketCapsData);

		let dateArr = getDates(new Date(1900,0,2), new Date(2030,0,2))
		await txn.batchInsert("dim_dates", dateArr, 10000);
		
		let newDateArr: any = []

		for (let i = 0; i < dateArr.length; i++){
			let date = new Date(dateArr[i]["year"], dateArr[i]["month"] - 1, dateArr[i]["day"])
			newDateArr.push(date)
		}

		let shortDateArr = newDateArr.slice(44250, 44700)
		
		for (let i = 0; i < 22; i++) {
			logger.debug(`reading chunk ${i}`);
			workbook = xlsx.readFile(`./seeds/import/chunk${i}.xlsx`);
			let chunkData = xlsx.utils.sheet_to_json(workbook.Sheets["Sheet1"]);
			//@ts-ignore
			let stockPriceData = chunkData.map((row: any) => {
				let obj = {};
				let { ticker, price, date } = row;

				ticker = ticker.toString().toUpperCase();
				let psqlDate = excelDateToJSDate(date)
				// console.log(psqlDate);
				obj["stock_id"] = Number(stockMap[ticker]);
				obj["price"] = price;
				obj["date_id"] = shortDateArr.map(Number).indexOf(+psqlDate) + 44251
				obj["created_at"] = psqlDate
				return obj;
			});
			await txn.batchInsert("stock_prices", stockPriceData, 10000);
			logger.debug(`finished insert chunk ${i}`);
		}

		await txn("users").insert(userData);
		await txn("comments").insert(commentData);
		await txn("portfolios").insert(portfolioData);
		await txn("watchlists").insert(watchlistData);
		await txn("watchlist_stock").insert(watchlistStockData);
		await txn("user_history").insert([{ user_id: 1 }]);
		await txn("user_history").insert([{ user_id: 2 }]);
		await txn("user_history").insert([{ user_id: 3 }]);
		await txn("dim_sentiments").insert(sentimentData);
		await txn("dim_indicators").insert(indicatorData);
		await txn("dim_countries").insert(countryData);
		await txn("dim_maturity_periods").insert(maturityPeriodData);
		await txn("dim_year_quarters").insert(yearQuarterData);
		
		//for getting back-up data only
		// await txn("economic_indicators").insert(economicBackup);
		// await txn("sentiment_indicators").insert(sentimentBackup);
		// await txn.batchInsert("treasury_rates", ratesBackup, 10000);

		await txn.commit();

		return;
	} catch (e) {
		await txn.rollback();
		console.log(e);
		return;
	}
}

function makeMap(obj: {}, obj2: {}): {} {
	let keyArr = Object.keys(obj2);
	obj[obj2[keyArr[1]]] = obj2[keyArr[0]].toString();
	return obj;
}

export function excelDateToJSDate(serial: number) {
	let utc_days = Math.floor(serial - 25569);
	let utc_value = utc_days * 86400;
	let date_info = new Date(utc_value * 1000);

	// let fractional_day = serial - Math.floor(serial) + 0.0000001;
	// let total_seconds = Math.floor(86400 * fractional_day);
	// let seconds = total_seconds % 60;
	// total_seconds -= seconds;

	// let hours = Math.floor(total_seconds / (60 * 60));
	// let minutes = Math.floor(total_seconds / 60) % 60;

	return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
}

// function sleep(ms: number) {
// 	return new Promise((resolve) => {
// 	  setTimeout(resolve, ms);
// 	});
//   }


function getDates(startDate: Date, stopDate: Date) {
    let dateArray = new Array();
    let currentDate = startDate;
    while (currentDate <= stopDate) {
		let newDate = new Date(currentDate)
        dateArray.push({year: newDate.getFullYear(), month: newDate.getMonth() + 1, day: newDate.getDate()});
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
}