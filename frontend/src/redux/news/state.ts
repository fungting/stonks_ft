export type News = {
	id: string;
	links: { canonical: string };
	attributes: {
		gettyImageUrl: string;
		title: string;
		themes: any;
		content: string;
	};
};

export type NewsState = {
	news: News[];
	isLoading: boolean;
};
