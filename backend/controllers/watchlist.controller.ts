import express, { Request } from "express";
import { WatchlistService } from "../services/watchlist.service";
import { getUser, wrapControllerMethod } from "../util/helper";
import { HttpError } from "../util/models";

export class WatchlistController {
	constructor(private watchlistService: WatchlistService) {
		this.router.get("/watchlist/all", wrapControllerMethod(this.getAllWatchlistsName));
		this.router.get("/watchlist/:watchlistId", wrapControllerMethod(this.get));
		this.router.post("/watchlist", wrapControllerMethod(this.post));
		this.router.put("/watchlist/:watchlistId", wrapControllerMethod(this.put));
		this.router.delete("/watchlist/:watchlistId", wrapControllerMethod(this.delete));
		this.router.post("/watchlist/:watchlistId/:stockId", wrapControllerMethod(this.addStock));
		this.router.delete("/watchlist/:watchlistId/:stockId", wrapControllerMethod(this.deleteStock));
	}

	router = express.Router();

	getAllWatchlistsName = async (req: Request) => {
		const user = getUser(req);
		if (user.id <= 0) throw new HttpError(400, "User not exist");

		return await this.watchlistService.getAllWatchlistsName(user.id);
	};

	get = async (req: Request) => {
		const watchlistId = Number(req.params.watchlistId);
		if (Number.isNaN(watchlistId) || watchlistId <= 0) throw new HttpError(400, "Watchlist not exist");

		const stocks = await this.watchlistService.getWatchlist(watchlistId);
		return { stocks };
	};

	post = async (req: Request) => {
		const user = getUser(req);
		if (user.id <= 0) throw new HttpError(400, "User not exist");

		const name = String(req.body.name).replace(/\s+/g, "");
		if (name === "") throw new HttpError(400, "Watchlist name cannot be empty");

		return await this.watchlistService.createWatchlist(user.id, name);
	};
	//need to check userId
	put = async (req: Request): Promise<{ message: string }> => {
		const watchlistId = Number(req.params.watchlistId);
		if (Number.isNaN(watchlistId) || watchlistId <= 0) throw new HttpError(400, "Watchlist not exist");

		const name = String(req.body.name).replace(/\s+/g, "");
		if (!name) throw new HttpError(400, "Watchlist name cannot be empty");

		return await this.watchlistService.changeWatchlistName(watchlistId, name);
	};
	//need to check userId
	delete = async (req: Request): Promise<{ message: string }> => {
		const watchlistId = Number(req.params.watchlistId);
		if (Number.isNaN(watchlistId) || watchlistId <= 0) throw new HttpError(400, "Watchlist not exist");

		return await this.watchlistService.deleteWatchlist(watchlistId);
	};
	//need to check userId
	addStock = async (req: Request): Promise<{ message: string }> => {
		const watchlistId = Number(req.params.watchlistId);
		const stockId = Number(req.params.stockId);
		if (Number.isNaN(watchlistId) || watchlistId <= 0) throw new HttpError(400, "Watchlist not exist");

		const result = await this.watchlistService.getStock(watchlistId, stockId);
		if (result) throw new HttpError(400, "Stock already exist");

		return await this.watchlistService.addStock(watchlistId, stockId);
	};
	//need to check userId
	deleteStock = async (req: Request): Promise<{ message: string }> => {
		const watchlistId = Number(req.params.watchlistId);
		if (Number.isNaN(watchlistId) || watchlistId <= 0) throw new HttpError(400, "Watchlist not exist");

		const stockId = Number(req.params.stockId);
		if (stockId <= 0) throw new HttpError(400, "Stock not found");

		return await this.watchlistService.deleteStock(watchlistId, stockId);
	};
}
