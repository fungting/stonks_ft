import { Stock } from "../stock/state";
import { Watchlist } from "./state";

export const getAllWatchlistsAction = (watchlists: Watchlist[]) => ({
	type: "@@Watchlist/get_all" as const,
	watchlists,
});

export const getWatchlistAction = ( stocks: Stock[]) => ({
	type: "@@Watchlist/get" as const,
	stocks,
});

export const addWatchlistAction = (watchlistId: number, name: string) => ({
	type: "@@Watchlist/add" as const,
	watchlistId,
	name,
});

export const renameWatchlistAction = (watchlistId: number, name: string) => ({
	type: "@@Watchlist/rename" as const,
	watchlistId,
	name,
});

export const deleteWatchlistAction = (watchlistId: number) => ({
	type: "@@Watchlist/delete" as const,
	watchlistId,
});

export const addStockToWatchlistAction = (stock: Stock) => ({
	type: "@@Watchlist/add_stock" as const,
	stock,
});

export const deleteStockFromWatchlistAction = (stockId: number) => ({
	type: "@@Watchlist/delete_stock" as const,
	stockId,
});

export const loadWatchlistAction = () => ({ type: "@@Watchlist/load" as const });

export type WatchlistAction =
	| ReturnType<typeof getAllWatchlistsAction>
	| ReturnType<typeof getWatchlistAction>
	| ReturnType<typeof addWatchlistAction>
	| ReturnType<typeof renameWatchlistAction>
	| ReturnType<typeof deleteWatchlistAction>
	| ReturnType<typeof addStockToWatchlistAction>
	| ReturnType<typeof deleteStockFromWatchlistAction>
	| ReturnType<typeof loadWatchlistAction>;
