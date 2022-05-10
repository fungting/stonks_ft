export type JWTPayload = {
	id: number;
	username: string;
	email: string;
	avatar: string;
	role: string;
};

export type Balance = {
	deposit: number;
	cash: number;
};

export type User = {
	token: string;
	payload: JWTPayload;
};

export type AuthState = {
	user: User | null;
	balance: Balance;
	error: string;
};
