import { CallHistoryMethodAction } from "connected-react-router";
import { Dispatch } from "redux";
import { AuthAction } from "../auth/action";
import { ThemeAction } from "../theme/action";
import { PortfolioAction } from "../portfolio/action";
import { WatchlistAction } from "../watchlist/action";
import { NewsAction } from "../news/action";
import { ScreenerAction } from "../screener/action";
import { StockAction } from "../stock/action";
import { MetaMaskAction } from "../metaMask/action";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "./state";
import { CalendarAction } from "../calendar/action";


export type RootAction =
| AuthAction
| ThemeAction
| WatchlistAction
| NewsAction
| ScreenerAction
| StockAction
| MetaMaskAction
| CallHistoryMethodAction
| PortfolioAction
| CalendarAction

export type RootThunkDispatch = ThunkDispatch<RootState, null, RootAction>;

export type RootDispatch = Dispatch<RootAction>;
