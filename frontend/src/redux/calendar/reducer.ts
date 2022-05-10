import { CalendarAction } from "./action";
import { CalendarState } from "./state";

const initialState: CalendarState = {
	all: [],
	today: [],
	past: [],
	next: [],
};

export function CalendarReducer(state: CalendarState = initialState, action: CalendarAction): CalendarState {
	switch (action.type) {
		case "@@Calendar/AllEarnings":
			const { all } = action;
			return { ...state, all };
		case "@@Calendar/earnings":
			const { today, past, next } = action;
			return { ...state, today, past, next };
		default:
			return state;
	}
}
