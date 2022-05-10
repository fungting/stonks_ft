import { WatchlistAction } from "./action";
import { WatchlistState } from "./state";

const initialState: WatchlistState = {
	watchlists: [],
	stocks: [],
	isLoading: false,
};

export function watchlistReducer(state: WatchlistState = initialState, action: WatchlistAction) {
	switch (action.type) {
		case "@@Watchlist/get_all":
			return {
				...state,
				watchlists: action.watchlists,
			};
		case "@@Watchlist/get":
			return {
				...state,
				stocks: action.stocks,
				isLoading: false,
			};
		case "@@Watchlist/add":
			const { watchlistId, name } = action;
			return {
				...state,
				watchlists: state.watchlists.concat([{ id: watchlistId, name }]),
			};
		case "@@Watchlist/rename":
			return {
				...state,
				watchlists: state.watchlists.map((watchlist) => {
					if (watchlist?.id === action.watchlistId) {
						return { id: action.watchlistId, name: action.name };
					}
					return watchlist;
				}),
			};
		case "@@Watchlist/delete":
			const newWatchlists = state.watchlists.filter((watchlist) => watchlist!.id !== action.watchlistId);
			return { ...state, watchlists: newWatchlists };
		case "@@Watchlist/add_stock":
			return { ...state, stocks: state.stocks.concat([action.stock]) };
		case "@@Watchlist/delete_stock":
			const newStocks = state.stocks.filter((stock) => stock!.id !== action.stockId);
			return { ...state, stocks: newStocks };
		case "@@Watchlist/load":
			return { ...state, isLoading: true };
		default:
			return state;
	}
}
