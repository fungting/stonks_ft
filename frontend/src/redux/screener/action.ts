import { IScreener, Item, ScreenerState } from "./state";

export const getIndustriesAction = (industries: Item[]) => ({
	type: "@@Screener/get_industry" as const,
	industries,
});

export const getSectorsAction = (sectors: Item[]) => ({
	type: "@@Screener/get_sector" as const,
	sectors,
});

export const addItemAction = (
	key: keyof Pick<ScreenerState, "addedIndustries" | "addedSectors">,
	item: Item,
	value: string
) => ({
	type: "@@Screener/add_item" as const,
	key,
	item,
	value,
});

export const removeItemAction = (item: Item, key: keyof Pick<ScreenerState, "addedIndustries" | "addedSectors">) => ({
	type: "@@Screener/remove_item" as const,
	item,
	key,
});

export const resetItemAction = (key: keyof Pick<ScreenerState, "addedIndustries" | "addedSectors">) => ({
	type: "@@Screener/reset_item" as const,
	key,
});

export const loadScreenResultAction = (stocks: IScreener[]) => ({
	type: "@@Screener/result" as const,
	stocks,
});

export const resetScreenerAction = () => ({
	type: "@@Screener/reset_form" as const,
});

export const loadScreenerAction = () => ({ type: "@@Screener/load" as const });

export type ScreenerAction =
	| ReturnType<typeof getIndustriesAction>
	| ReturnType<typeof getSectorsAction>
	| ReturnType<typeof addItemAction>
	| ReturnType<typeof removeItemAction>
	| ReturnType<typeof resetItemAction>
	| ReturnType<typeof loadScreenResultAction>
	| ReturnType<typeof resetScreenerAction>
	| ReturnType<typeof loadScreenerAction>;
