import { Knex } from "knex";
import { camelCaseKeys } from "../util/helper";
import { Industry, Sector } from "../util/models";

export class ScreenerService {
	constructor(private knex: Knex) {}

	async getAllIndustries(): Promise<Industry[]> {
		return await this.knex("industries").select("id", "name").where("industries.id", "<", 198);
	}

	async getAllSectors(): Promise<Sector[]> {
		return await this.knex("sectors").select("id", "name").where("sectors.id", "<", 34);
	}

	async screenStocks(
		price: any,
		offYearHigh: any,
		marketCap: any,
		rS: any,
		industryRs: any,
		industryRank: any,
		industryIds: number[],
		sectorIds: number[]
	) {
		return camelCaseKeys(
			await this.knex("screeners")
				.select(
					"stock_id as id",
					"ticker",
					"name",
					"price",
					"change",
					"change_per",
					"year_high",
					"market_cap",
					"rs_rating",
					"sector",
					"industry",
					"industry_rs",
					"industry_rank"
				)
				.whereIn("industry_id", industryIds)
				.whereIn("sector_id", sectorIds)
				.whereBetween("price", price)
				.whereBetween("off_year_high", offYearHigh)
				.whereBetween("market_cap", marketCap)
				.whereBetween("rs_rating", rS)
				.whereBetween("industry_rs", industryRs)
				.whereBetween("industry_rank", industryRank)
		);
	}
}
