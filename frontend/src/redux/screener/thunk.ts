import { defaultErrorSwal } from "../../components/ReactSwal";
import { FormState } from "../../components/ScreenerForm";
import { callApi } from "../api";
import { RootDispatch } from "../store/action";
import { getIndustriesAction, getSectorsAction, loadScreenerAction, loadScreenResultAction } from "./action";
import { Item } from "./state";

export function getIndustriesThunk() {
	return async (dispatch: RootDispatch) => {
		const result = await callApi("/industries");
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(getIndustriesAction(result));
		}
	};
}

export function getSectorsThunk() {
	return async (dispatch: RootDispatch) => {
		const result = await callApi("/sectors");
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(getSectorsAction(result));
		}
	};
}

export function loadScreenResultThunk(data: FormState, addedIndustries: Item[], addedSectors: Item[]) {
	return async (dispatch: RootDispatch) => {
		dispatch(loadScreenerAction());
		const obj = {
			...data,
			includedIndustry: addedIndustries.filter((item) => item.isInclude).map((item) => item.id),
			excludedIndustry: addedIndustries.filter((item) => !item.isInclude).map((item) => item.id),
			includedSector: addedSectors.filter((item) => item.isInclude).map((item) => item.id),
			excludedSector: addedSectors.filter((item) => !item.isInclude).map((item) => item.id),
		};

		const result = await callApi("/screen", "POST", obj);
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(loadScreenResultAction(result));
		}
	};
}
