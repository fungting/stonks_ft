import { FinnhubTrade } from "../../components/Portfolio";
import { UserPortfolio } from "./state";

export const getPortfolioAction = (portfolio: UserPortfolio[]) => ({
	type: "@@Portfolio/get" as const,
	portfolio,
});

export const getPortfolioPriceAction = (stocks: Array<FinnhubTrade>) => ({
	type: "@@Portfolio/getPrice" as const,
	stocks,
});

export type PortfolioAction = ReturnType<typeof getPortfolioAction> | ReturnType<typeof getPortfolioPriceAction>;
