declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}

export class HttpError extends Error {
	constructor(public status: number, public message: string) {
		super(message);
	}
}

export type User = {
	id: number;
	username: string;
	email: string;
	password: string;
	avatar: string;
	role: string;
};

export type GoogleInfo = {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	locale: string;
};

export type Sector = {
	id: number;
	name: string;
};

export type Industry = {
	id: number;
	name: string;
	sector_id: number;
};

export type Stock = {
	id: number;
	ticker: string;
	name: string;
	price?: number;
	prevPrice?: number;
	industryName?: string;
	sectorName?: string;
};

export type UserComment = {
	userId: number;
	stockId: number;
	content: string;
	avatar?: string;
};

export type Portfolio = {
	ticker: string;
	name: string;
	shares: string | number;
	unitCost?: string | number;
	totalCost?: string | number;
	sectorName: string;
};

export enum Table {
	users = "users",
	watchlist = "watchlist",
	watchlistStock = "watchlist_stock",
}

// for xlsx Data
export type UserData = Omit<User, "id"> & { email: string };
export type SectorData = Omit<Sector, "id">;
export type IndustryData = Omit<Industry, "id">;
export type StockData = {
	name: string;
	industry_id: number;
	sector_id: number;
};
export type RawIndustryData = {
	name: string;
	sector: string;
	sector_id: number;
};
export type RawStockData = {
	name: string;
	industry_name: string;
	market_cap: number;
	industry_id: number;
	sector_id: number;
};

export type PortfolioData = {
	user_id: number;
	stock_id: number;
	position_size: number;
	unit_cost: number;
};
