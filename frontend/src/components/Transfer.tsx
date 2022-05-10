import "../css/Transfer.css";
import MetaMaskOnboarding from "@metamask/onboarding";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTokenThunk } from "../redux/metaMask/thunk";
import { RootState } from "../redux/store/state";
import { getChainIdThunk } from "../redux/metaMask/thunk";
import { getMetaMaskAction, getChainIdAction } from "../redux/metaMask/action";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { defaultErrorSwal } from "./ReactSwal";
import TransferForm from "./TransferForm";

export default function Transfer() {
	const dispatch = useDispatch();
	const account = useSelector((state: RootState) => state.metaMask.account);
	const chainId = useSelector((state: RootState) => state.metaMask.chainId);
	const error = useSelector((state: RootState) => state.metaMask.error);
	const { method } = useParams<{ method: string }>();

	useEffect(() => {
		if (MetaMaskOnboarding.isMetaMaskInstalled()) {
			const ethereum = window.ethereum;

			const handleNewAccount = (newAccount: string[]) => {
				dispatch(getMetaMaskAction(newAccount[0]));
			};
			const handleChainChanged = (chainId: string) => {
				dispatch(getChainIdAction(parseInt(chainId, 16)));
			};

			ethereum.on("accountsChanged", handleNewAccount);
			ethereum.on("chainChanged", handleChainChanged);
			return () => {
				ethereum.removeListener("accountsChanged", handleNewAccount);
				ethereum.removeListener("chainChanged", handleChainChanged);
			};
		}
	}, [dispatch]);

	useEffect(() => {
		if (account) {
			dispatch(getChainIdThunk());
		}
	}, [dispatch, account, chainId]);

	useEffect(() => {
		if (chainId === 43113) {
			dispatch(getTokenThunk());
		}
	}, [dispatch, chainId]);

	return (
		<>
			<Helmet>
				<title>{method[0].toUpperCase() + method.substring(1, method.length)} | Stonks</title>
			</Helmet>
			<TransferForm />
			{error && defaultErrorSwal(error)}
		</>
	);
}
