import { EarningCalendar, EarningTable } from "./state";

export const getAllEarningsAction = (all: EarningCalendar[]) => ({
	type: "@@Calendar/AllEarnings" as const,
	all,
});

export const getEarningsTableAction = (today: EarningTable[], past: EarningTable[], next: EarningTable[]) => ({
	type: "@@Calendar/earnings" as const,
	today,
	past,
	next,
});

export type CalendarAction = ReturnType<typeof getAllEarningsAction> | ReturnType<typeof getEarningsTableAction>;
