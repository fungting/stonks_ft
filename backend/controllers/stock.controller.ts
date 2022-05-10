import express, { Request } from "express";
import { StockService } from "../services/stock.service";
import { HttpError } from "../util/models";
import yahooFinance from "yahoo-finance2";
import { getUser, wrapControllerMethod } from "../util/helper";
import { isLoggedIn } from "../middlewares/guard";
import { logger } from "../util/logger";

export class StockController {
	constructor(private stockService: StockService) {
		this.router.get("/stocks/:ticker", wrapControllerMethod(this.getStockInfo));
		this.router.get("/stocks/:ticker/shares", wrapControllerMethod(this.getShares));
		this.router.get("/stocks/:ticker/news", wrapControllerMethod(this.getStockNews));
		this.router.post("/stocks/:ticker/buy", isLoggedIn, wrapControllerMethod(this.buy));
		this.router.post("/stocks/:ticker/sell", isLoggedIn, wrapControllerMethod(this.sell));
	}

	router = express.Router();

	getStockInfo = async (req: Request) => {
		const ticker = String(req.params.ticker).toUpperCase();
		if (!ticker.match(/[a-zA-z]/g)) throw new HttpError(400, "Invalid ticker");
		const stockArr = await this.stockService.getStockInfo(ticker);

		if (stockArr.length === 0) {
			throw new HttpError(400, "Stock not found");
		} else if (stockArr.length === 1) {
			return stockArr[0];
		}
		return {
			id: stockArr[0].id,
			ticker: stockArr[0].ticker,
			name: stockArr[0].name,
			price: stockArr[0].price || null,
			prevPrice: stockArr[1].price || null,
			sectorName: stockArr[0].sectorName,
			industryName: stockArr[0].industryName,
		};
	};

	getShares = async (req: Request) => {
		const user = getUser(req);
		if (user.id <= 0) throw new HttpError(400, "User not exist");

		const ticker = String(req.params.ticker).toUpperCase();
		if (!ticker.match(/[a-zA-z]/g)) throw new HttpError(400, "Invalid ticker");

		const shares = await this.stockService.getShare(ticker, user.id);
		return { shares };
	};

	getStockNews = async (req: Request) => {
		const ticker = String(req.params.ticker).toUpperCase();
		if (!ticker.match(/[a-zA-z]/g)) throw new HttpError(400, "Invalid ticker");
		try {
			const news = (await yahooFinance.search(ticker, { newsCount: 10 })).news;
			return news;
		} catch (error) {
			logger.info(error);
			return [];
		}
	};

	buy = async (req: Request) => {
		const user = getUser(req);
		if (user.id <= 0) throw new HttpError(400, "User not exist");

		const ticker = String(req.params.ticker).toUpperCase();
		if (!ticker.match(/[a-zA-z]/g)) throw new HttpError(400, "Invalid ticker");

		const stockArr = await this.stockService.getStockInfo(ticker);
		if (stockArr.length === 0) throw new HttpError(400, "Stock not found");

		const shares = Number(req.body.shares);
		if (Number.isNaN(shares) || shares <= 0) throw new HttpError(400, "Share number must be positive");

		const price = Number(req.body.price);
		if (Number.isNaN(price) || price <= 0) throw new HttpError(400, "Price must be positive");

		const cash = await this.stockService.getCash(user.id);
		const cost = price * shares;
		if (cost > cash) throw new HttpError(400, "Not enough cash");

		const remainingCash = cash - cost;
		const error = await this.stockService.trade(user.id, stockArr[0].id, shares, price, remainingCash);
		if (error) throw error;

		const ownedShares = await this.stockService.getShare(ticker, user.id);

		return { cash: remainingCash, shares: ownedShares };
	};

	sell = async (req: Request) => {
		const user = getUser(req);
		if (user.id <= 0) throw new HttpError(400, "User not exist");

		const ticker = String(req.params.ticker).toUpperCase();
		if (!ticker.match(/[a-zA-z]/g)) throw new HttpError(400, "Invalid ticker");

		const stockArr = await this.stockService.getStockInfo(ticker);
		if (stockArr.length === 0) throw new HttpError(400, "Stock not found");

		const shares = Number(req.body.shares);
		if (Number.isNaN(shares) || shares <= 0) throw new HttpError(400, "Share number must be positive");

		const ownedShares = await this.stockService.getShare(ticker, user.id);

		if (shares > ownedShares) throw new HttpError(400, "Not enough shares");

		const price = Number(req.body.price);
		if (Number.isNaN(price) || price <= 0) throw new HttpError(400, "Price must be positive");

		const profit = price * shares;
		const cash = await this.stockService.getCash(user.id);

		const remainingCash = cash + profit;
		const error = await this.stockService.trade(user.id, stockArr[0].id, -shares, price, remainingCash);
		if (error) throw error;

		return { cash: remainingCash, shares: ownedShares - shares };
	};
}
