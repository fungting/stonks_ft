export const getMetaMaskAction = (account: string) => ({
	type: "@@MetaMask/getAccount" as const,
	account,
});

export const getChainIdAction = (chainId: number) => ({
	type: "@@MetaMask/getChainId" as const,
	chainId,
});

export const getTokenAction = (token: number) => ({
	type: "@@MetaMask/getToken" as const,
	token,
});

export const loadingMetaMaskAction = () => ({
	type: "@@MetaMask/loading" as const,
});

export const endLoadingMetaMaskAction = () => ({
	type: "@@MetaMask/endLoading" as const,
});

export const apiFailedAction = (error: any) => ({
	type: "@@MetaMask/apiFailed" as const,
	error,
});

export type MetaMaskAction =
	| ReturnType<typeof getMetaMaskAction>
	| ReturnType<typeof getChainIdAction>
	| ReturnType<typeof getTokenAction>
	| ReturnType<typeof loadingMetaMaskAction>
	| ReturnType<typeof endLoadingMetaMaskAction>
	| ReturnType<typeof apiFailedAction>;
