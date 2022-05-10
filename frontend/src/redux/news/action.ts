import { News } from "./state";

export const getNewsAction = (news: News[]) => ({
	type: "@@/News/get" as const,
	news,
});

export const loadingNewsAction = () => ({
	type: "@@/News/loading" as const,
});

export type NewsAction = ReturnType<typeof getNewsAction> | ReturnType<typeof loadingNewsAction>;
