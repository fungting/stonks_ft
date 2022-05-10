import { StockAction } from "./action";
import { StockState } from "./state";

const initialState: StockState = {
	stock: null,
	comments: [],
	news: [],
	shares: 0,
};

export function stockReducer(state: StockState = initialState, action: StockAction): StockState {
	switch (action.type) {
		case "@@Stock/getStock":
			return { ...state, stock: action.stock };
		case "@@Stock/getComments":
			return { ...state, comments: action.comments };
		case "@@Stock/postComment":
			return { ...state, comments: state.comments.concat(action.comment) };
		case "@@Stock/getNews":
			return { ...state, news: action.news };
		case "@@Stock/getShares":
			return { ...state, shares: action.shares };
		default:
			return state;
	}
}
