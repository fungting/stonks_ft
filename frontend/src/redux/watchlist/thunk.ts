import { push } from "connected-react-router";
import { defaultErrorSwal, defaultSuccessSwal } from "../../components/ReactSwal";
import { callApi } from "../api";
import { RootDispatch } from "../store/action";
import {
	addStockToWatchlistAction,
	addWatchlistAction,
	deleteStockFromWatchlistAction,
	deleteWatchlistAction,
	getAllWatchlistsAction,
	getWatchlistAction,
	renameWatchlistAction,
	loadWatchlistAction,
} from "./action";

export function getAllWatchlistsThunk() {
	return async (dispatch: RootDispatch) => {
		const result = await callApi("/watchlist/all");
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(getAllWatchlistsAction(result));
		}
	};
}

export function getWatchlistThunk(watchlistId: number | null) {
	return async (dispatch: RootDispatch) => {
		dispatch(loadWatchlistAction())
		dispatch(push(`/watchlist/${watchlistId}`));
		const result = await callApi(`/watchlist/${watchlistId}`);
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(getWatchlistAction(result.stocks));
		}
	};
}

export function addWatchlistThunk(name: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi("/watchlist", "POST", { name });
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(addWatchlistAction(result.id, name));
			defaultSuccessSwal(`Watchlist ${name} is added`);
		}
	};
}

export function renameWatchlistThunk(watchlistId: number, name: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/watchlist/${watchlistId}`, "PUT");
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(renameWatchlistAction(watchlistId, name));
			defaultSuccessSwal(`Watchlist renamed to ${name}`);
		}
	};
}

export function deleteWatchlistThunk(watchlistId: number, name: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/watchlist/${watchlistId}`, "DELETE");
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(deleteWatchlistAction(watchlistId));
			defaultSuccessSwal(`Watchlist ${name} is deleted`);
		}
	};
}

export function addStockThunk(watchlistId: number, ticker: string) {
	return async (dispatch: RootDispatch) => {
		const stock = await getStock(ticker);
		if (stock && watchlistId > 0) {
			const stockId = stock.id;
			const result = await callApi(`/watchlist/${watchlistId}/${stockId}`, "POST");
			if ("error" in result) {
				defaultErrorSwal(result.error);
			} else {
				dispatch(addStockToWatchlistAction(stock));
				defaultSuccessSwal(`${stock.ticker} is added to watchlist`);
			}
		}
	};
}

async function getStock(ticker: string) {
	const result = await callApi(`/stocks/${ticker}`);
	if ("error" in result) {
		defaultErrorSwal(result.error);
		return;
	}
	return result;
}

export function deleteStockThunk({
	watchlistId,
	stockId,
	ticker,
	watchlistName,
}: {
	watchlistId: number;
	stockId: number;
	ticker: string;
	watchlistName: string;
}) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/watchlist/${watchlistId}/${stockId}`, "DELETE");
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(deleteStockFromWatchlistAction(stockId));
			defaultSuccessSwal(`${ticker} is deleted from ${watchlistName}`);
		}
	};
}
