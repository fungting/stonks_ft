import { ThemeAction } from "./action";
import { ThemeState } from "./state";

const initialState = {
	theme: localStorage.getItem("theme") || "light",
};

export function themeReducerLogic(state: ThemeState, action: ThemeAction) {
	switch (action.type) {
		case "@@Theme/toggle":
			return { theme: state.theme === "light" ? "dark" : "light" };
		default:
			return state;
	}
}

export function themeReducer(state: ThemeState = initialState, action: ThemeAction) {
	const newState = themeReducerLogic(state, action);
	if (newState !== state) {
		localStorage.setItem("theme", newState.theme);
	}
	return newState;
}
