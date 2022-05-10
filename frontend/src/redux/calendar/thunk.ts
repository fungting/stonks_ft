import { defaultErrorSwal } from "../../components/ReactSwal";
import { callApi } from "../api";
import { RootDispatch } from "../store/action";
import { getAllEarningsAction, getEarningsTableAction } from "./action";

export function getAllEarningsThunk() {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/calendar/earnings/all`);
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(getAllEarningsAction(result.earnings));
		}
	};
}

export function getEarningsTableThunk() {
	return async (dispatch: RootDispatch) => {
		const today = await callApi(`/calendar/earnings/now`);
		const past = await callApi(`/calendar/earnings/past`);
		const next = await callApi(`/calendar/earnings/next`);

		if ("error" in today) {
			defaultErrorSwal(today.error);
		} else if ("error" in past) {
			defaultErrorSwal(past.error);
		} else if ("error" in next) {
			defaultErrorSwal(next.error);
		} else {
			dispatch(getEarningsTableAction(today.earnings, past.earnings, next.earnings));
		}
	};
}
