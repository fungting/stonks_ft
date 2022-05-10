import express, { Request } from "express";
// import { HttpError } from "../util/models";
import { ScreenerService } from "../services/screener.service";
import { wrapControllerMethod } from "../util/helper";

export class ScreenerController {
	constructor(private screenerService: ScreenerService) {
		this.router.get("/industries", wrapControllerMethod(this.getIndustries));
		this.router.get("/sectors", wrapControllerMethod(this.getSectors));
		this.router.post("/screen", wrapControllerMethod(this.filterStocks));
	}

	router = express.Router();

	getIndustries = async (req: Request) => await this.screenerService.getAllIndustries();

	getSectors = async (req: Request) => await this.screenerService.getAllSectors();

	filterStocks = async (req: Request) => {
		console.log(req.body);
		const {
			includedIndustry,
			excludedIndustry,
			includedSector,
			excludedSector,
			minPrice,
			maxPrice,
			minWeekPercent,
			maxWeekPercent,
			minMarketCap,
			maxMarketCap,
			minRS,
			maxRS,
			minIndustryRS,
			maxIndustryRS,
			minIndustryRank,
			maxIndustryRank,
		} = req.body;

		let industryIds = includedIndustry;
		let sectorIds = includedSector;
		let price = [minPrice, maxPrice];
		let offYearHigh = [minWeekPercent, maxWeekPercent];
		let marketCap = [minMarketCap, maxMarketCap];
		let rS = [minRS, maxRS];
		let industryRs = [minIndustryRS, maxIndustryRS];
		let industryRank = [minIndustryRank, maxIndustryRank];

		if (includedIndustry.length == 0) {
			industryIds = Array.from({ length: 197 }, (_, i) => i + 1); //Return array [1, 2, ..., 197]
		}

		if (excludedIndustry) {
			industryIds = industryIds.filter((id: number) => !excludedIndustry.includes(id));
		}

		if (includedSector.length == 0) {
			sectorIds = Array.from({ length: 33 }, (_, i) => i + 1); //Return array [1, 2, ..., 33]
		}

		if (excludedSector) {
			sectorIds = sectorIds.filter((id: number) => !excludedSector.includes(id));
		}

		console.log(price, offYearHigh, marketCap, rS, industryRs, industryRank, industryIds, sectorIds);

		const result = await this.screenerService.screenStocks(
			price,
			offYearHigh,
			marketCap,
			rS,
			industryRs,
			industryRank,
			industryIds,
			sectorIds
		);

		console.log("result :", result);

		return result;
	};
}
