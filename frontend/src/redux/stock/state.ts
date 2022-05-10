export type Stock = {
	id: number;
	ticker: string;
	name: string;
	price: number;
	prevPrice?: number;
	sectorName?: string;
	industryName?: string;
};

export type StockNews = {
	uuid: string;
	link: string;
	providerPublishTime: string;
	publisher: string;
	title: string;
	type: string;
};

export type UserComment = {
	username: string;
	content: string;
	avatar: string;
	createdAt: string;
};

export type StockState = {
	stock: Stock | null;
	shares: number;
	comments: UserComment[];
	news: StockNews[];
};
