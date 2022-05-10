import { FinnhubTrade } from "../../components/Portfolio";

export type UserPortfolio = {
	ticker: string;
	name: string;
	shares: string;
	totalCost: number;
	sectorName: string;
};

export type CalcPortfolio = {
	ticker: string;
	name: string;
	price: number | null;
	shares: number;
	avgCost: number;
	totalCost: number;
	marketValue: number | null;
	profit: number | null;
};

export type PortfolioState = {
	portfolio: UserPortfolio[];
	price: Array<FinnhubTrade>;
};
