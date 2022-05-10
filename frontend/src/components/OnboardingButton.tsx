import MetaMaskOnboarding from "@metamask/onboarding";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMetaMaskThunk } from "../redux/metaMask/thunk";

import { RootState } from "../redux/store/state";

const ONBOARD_TEXT = "Click here to install MetaMask";
const CONNECT_TEXT = "Connect";

export function OnboardingButton() {
	const dispatch = useDispatch();
	const [buttonText, setButtonText] = useState(ONBOARD_TEXT);

	const account = useSelector((state: RootState) => state.metaMask.account);
	const onboarding = useRef<MetaMaskOnboarding>();

	useEffect(() => {
		if (!onboarding.current) {
			onboarding.current = new MetaMaskOnboarding();
		}
	}, []);

	useEffect(() => {
		if (MetaMaskOnboarding.isMetaMaskInstalled()) {
			if (account !== "") {
				onboarding.current!.stopOnboarding();
			} else {
				setButtonText(CONNECT_TEXT);
			}
		}
	}, [account]);

	const onClick = async () => {
		if (MetaMaskOnboarding.isMetaMaskInstalled()) {
			dispatch(getMetaMaskThunk());
		} else {
			onboarding.current!.startOnboarding();
		}
	};
	return (
		<button className="stonk-btn" onClick={onClick}>
			{buttonText}
		</button>
	);
}
