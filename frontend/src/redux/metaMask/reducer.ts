import { MetaMaskAction } from "./action";
import { MetaMaskState } from "./state";

const initialState: MetaMaskState = {
	account: "",
	chainId: 0,
	token: null,
	isLoading: false,
	error: "",
};

export function metaMaskReducer(state: MetaMaskState = initialState, action: MetaMaskAction): MetaMaskState {
	switch (action.type) {
		case "@@MetaMask/getAccount":
			return { ...state, account: action.account, isLoading: false, error: "" };
		case "@@MetaMask/getChainId":
			return { ...state, chainId: action.chainId, isLoading: false, error: "" };
		case "@@MetaMask/getToken":
			return { ...state, token: action.token, isLoading: false, error: "" };
		case "@@MetaMask/loading":
			return { ...state, isLoading: true };
		case "@@MetaMask/endLoading":
			return { ...state, isLoading: false };
		case "@@MetaMask/apiFailed":
			return { ...state, isLoading: false, error: action.error };
		default:
			return state;
	}
}
