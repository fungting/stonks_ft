import { push } from "connected-react-router";
import { defaultErrorSwal, defaultSuccessSwal } from "../../components/ReactSwal";
import { callApi } from "../api";
import { getCashAction } from "../auth/action";
import { RootDispatch } from "../store/action";
import { getCommentsAction, getStockNewsAction, getStockAction, postCommentAction, getSharesAction } from "./action";

export function getStockThunk(ticker: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/stocks/${ticker}`);
		if ("error" in result) {
			dispatch(push("/404"));
		} else {
			dispatch(getStockAction(result));
		}
	};
}

export function getCommentsThunk(stockId: number) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/comment/${stockId}`);
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(getCommentsAction(result));
		}
	};
}

export function postCommentThunk(stockId: number, content: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/comment/${stockId}`, "POST", { content });
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(postCommentAction(result.comment));
		}
	};
}

export function getStockNewsThunk(ticker: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/stocks/${ticker}/news`);
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(getStockNewsAction(result));
		}
	};
}

export function getSharesThunk(ticker: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/stocks/${ticker}/shares`);
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(getSharesAction(result.shares));
		}
	};
}

export function buyStockThunk(ticker: string, shares: number, price: number) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/stocks/${ticker}/buy`, "POST", { shares, price });
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(getCashAction(Number(result.cash)));
			dispatch(getSharesAction(Number(result.shares)));
			defaultSuccessSwal(`Bought ${shares} ${ticker}`);
		}
	};
}

export function sellStockThunk(ticker: string, shares: number, price: number) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/stocks/${ticker}/sell`, "POST", { shares, price });
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(getCashAction(Number(result.cash)));
			dispatch(getSharesAction(Number(result.shares)));
			defaultSuccessSwal(`Sold ${shares} ${ticker}`);
		}
	};
}
