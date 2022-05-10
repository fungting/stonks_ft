import { Knex } from "knex";
import { camelCaseKeys } from "../util/helper";
import { Stock } from "../util/models";

export class WatchlistService {
	constructor(private knex: Knex) {}

	async getWatchlist(watchlistId: number): Promise<Stock[]> {
		const stocks = createStockArr(await this.queryWatchlist(watchlistId));
		return stocks;
	}

	async createWatchlist(userId: number, name: string): Promise<number> {
		return (await this.knex("watchlists").insert({ user_id: userId, name }).returning(["id"]))[0];
	}

	async changeWatchlistName(watchlistId: number, name: string): Promise<{ message: string }> {
		await this.knex("watchlist").update(name).where({ id: watchlistId });
		return { message: `watchlist name changed to ${name}` };
	}

	async deleteWatchlist(watchlistId: number): Promise<{ message: string }> {
		await this.knex("watchlist_stock").delete().where("watchlist_id", watchlistId);
		await this.knex("watchlists").delete().where("id", watchlistId);
		return { message: "watchlist deleted" };
	}

	async getAllWatchlistsName(userId: number): Promise<{ id: number; name: string }[]> {
		return await this.knex("watchlists").select("id", "name").where("user_id", userId);
	}

	async getStock(watchlistId: number, stockId: number): Promise<{ stockId: string }> {
		return camelCaseKeys(
			await this.knex("watchlist_stock")
				.select("stock_id")
				.where("watchlist_id", watchlistId)
				.where("stock_id", stockId)
		)[0];
	}

	async addStock(watchlistId: number, stockId: number): Promise<{ message: string }> {
		await this.knex("watchlist_stock").insert({ watchlist_id: watchlistId, stock_id: stockId });
		return { message: `${stockId} added to watchlist ${watchlistId}` };
	}

	async deleteStock(watchlistId: number, stockId: number): Promise<{ message: string }> {
		await this.knex("watchlist_stock").delete().where("stock_id", stockId).where("watchlist_id", watchlistId);
		return { message: "stock deleted" };
	}

	async queryWatchlist(watchlistId: number): Promise<any> {
		return camelCaseKeys(
			(
				await this.knex.raw(
					/*sql*/ `select s.ticker, s.id stock_id, s.name stock_name, sp.price, sp.created_at
				from watchlist_stock ws 
				join stocks s on s.id = ws.stock_id
				join stock_prices sp on sp.stock_id = s.id 
				where sp.created_at 
				in (SELECT distinct created_at FROM stock_prices sp order by created_at desc limit 2) 
				and ws.watchlist_id = ?
				order by ticker, created_at`,
					[watchlistId]
				)
			).rows
		);
	}
}

function createStockArr(queryArr: any[]): Stock[] {
	let stocksArr: any[] = [];
	for (let i = 0; i < queryArr.length; i += 2) {
		stocksArr.push({
			id: queryArr[i].stockId,
			name: queryArr[i].stockName,
			ticker: queryArr[i].ticker,
			prevPrice: queryArr[i].price,
			price: queryArr[i + 1].price,
		});
	}
	return stocksArr;
}
