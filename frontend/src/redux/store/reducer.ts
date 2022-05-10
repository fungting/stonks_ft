import { combineReducers } from "redux";
import { authReducer } from "../auth/reducer";
import { RootState } from "./state";
import { history } from "./history";
import { connectRouter } from "connected-react-router";
import { themeReducer } from "../theme/reducer";
import { portfolioReducer } from "../portfolio/reducer";
import { watchlistReducer } from "../watchlist/reducer";
import { newsReducer } from "../news/reducer";
import { screenerReducer } from "../screener/reducer";
import { stockReducer } from "../stock/reducer";
import { metaMaskReducer } from "../metaMask/reducer";
import { RootAction } from "./action";
import { CalendarReducer } from "../calendar/reducer";
const appReducer = combineReducers<RootState>({
	auth: authReducer,
	news: newsReducer,
	screener: screenerReducer,
	stock: stockReducer,
	theme: themeReducer,
	metaMask: metaMaskReducer,
	watchlist: watchlistReducer,
	portfolio: portfolioReducer,
	calendar: CalendarReducer,
	router: connectRouter(history),
});

export const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: RootAction) => {
	if (action.type === "@@Auth/logout") {
		return appReducer(undefined, action);
	} else {
		return appReducer(state, action);
	}
};
