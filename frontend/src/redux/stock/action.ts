import { Stock, StockNews, UserComment } from "./state";

export const getStockAction = (stock: Stock) => ({
	type: "@@Stock/getStock" as const,
	stock,
});

export const getCommentsAction = (comments: UserComment[]) => ({
	type: "@@Stock/getComments" as const,
	comments,
});

export const postCommentAction = (comment: UserComment) => ({
	type: "@@Stock/postComment" as const,
	comment,
});

export const getStockNewsAction = (news: StockNews[]) => ({
	type: "@@Stock/getNews" as const,
	news,
});

export const getSharesAction = (shares: number) => ({
	type: "@@Stock/getShares" as const,
	shares,
});

export type StockAction =
	| ReturnType<typeof getStockAction>
	| ReturnType<typeof getCommentsAction>
	| ReturnType<typeof postCommentAction>
	| ReturnType<typeof getStockNewsAction>
	| ReturnType<typeof getSharesAction>;
