import { ScreenerAction } from "./action";
import { ScreenerState } from "./state";

const initialState: ScreenerState = {
	industries: [],
	sectors: [],
	stocks: [],
	addedIndustries: [],
	addedSectors: [],
	isLoading: false,
};

export function screenerReducer(state: ScreenerState = initialState, action: ScreenerAction):ScreenerState {
	switch (action.type) {
		case "@@Screener/get_industry":
			return { ...state, industries: action.industries };
		case "@@Screener/get_sector":
			return { ...state, sectors: action.sectors };
		case "@@Screener/add_item": {
			const { key, item, value } = action;
			const isInclude = value === "include";
			return {
				...state,
				[key]: state[key].concat({ ...item, isInclude }),
			};
		}
		case "@@Screener/remove_item": {
			const { key } = action;
			return {
				...state,
				[key]: state[key].filter((item) => item.id !== action.item.id),
			};
		}
		case "@@Screener/result":
			return {
				...state,
				stocks: action.stocks,
				isLoading: false,
			};
		case "@@Screener/reset_item":
			return {
				...state,
				[action.key]: [],
			};
		case "@@Screener/reset_form":
			return {
				...state,
				addedIndustries: [],
				addedSectors: [],
			};
		case "@@Screener/load":
			return { ...state, isLoading: true };
		default:
			return state;
	}
}
