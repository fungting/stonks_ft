import { AuthAction } from "./action";
import { AuthState, JWTPayload, User } from "./state";
import jwtDecode from "jwt-decode";

function getUser(token: string | null): User | null {
	if (!token) return null;
	try {
		const payload: JWTPayload = jwtDecode(token);
		return { payload, token };
	} catch (error) {
		console.log(error);
		return null;
	}
}

const token = localStorage.getItem("token");

const initialState: AuthState = {
	user: getUser(token),
	balance: { deposit: 0, cash: 0 },
	error: "",
};

export function authReducer(state: AuthState = initialState, action: AuthAction): AuthState {
	switch (action.type) {
		case "@@Auth/login": {
			return { ...state, user: getUser(action.token), error: "" };
		}
		case "@@Auth/logout":
			return { ...state, user: null, error: "" };
		case "@@Auth/register": {
			return { ...state, user: getUser(action.token), error: "" };
		}
		case "@@Auth/balance":
			const { deposit, cash } = action;
			return { ...state, balance: { deposit: Number(deposit), cash: Number(cash) }, error: "" };
		case "@@Auth/cash":
			return { ...state, balance: { ...state.balance, cash: action.cash }, error: "" };
		case "@@Auth/apiFailed":
			return { ...state, error: action.msg };
		default:
			return state;
	}
}
