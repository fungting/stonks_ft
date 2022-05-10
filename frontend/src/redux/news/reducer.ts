import { NewsAction } from "./action";
import { NewsState } from "./state";

const initialState: NewsState = { news: [], isLoading: true };

export function newsReducer(state: NewsState = initialState, action: NewsAction) {
	switch (action.type) {
		case "@@/News/get":
			return { news: action.news, isLoading: false };
		case "@@/News/loading":
			return { news: state.news, isLoading: true };
		default:
			return state;
	}
}
