export type EarningCalendar = {
	createdAt: string;
	ticker: string;
	releaseTime: string;
};

export type EarningTable = {
	createdAt: string;
	ticker: string;
	name: string;
	year: number;
	quarter: number;
	epsEstimated: string;
	epsReported: string | null;
	epsSurprise?: string | null;
	revenueEstimated: string;
	revenueReported: string | null;
	revenueSurprise?: string | null;
};

export type CalendarState = {
	all: EarningCalendar[];
	today: EarningTable[];
	past: EarningTable[];
	next: EarningTable[];
};
