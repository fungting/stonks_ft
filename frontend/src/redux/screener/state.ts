export type Item = {
	id?: number;
	name: string;
	isInclude?: boolean;
};

export type IScreener = {
	id: number;
	ticker: string;
	name: string;
	price: string;
	change: string;
	changePer: string;
	yearHigh: string;
	marketCap: string;
	rsRating: string;
	sector: string;
	industry: string;
	industryRs: string;
	industryRank: string;
};

export type ScreenerState = {
	industries: Item[];
	sectors: Item[];
	stocks: IScreener[];
	addedIndustries: Item[];
	addedSectors: Item[];
	isLoading: boolean;
};
