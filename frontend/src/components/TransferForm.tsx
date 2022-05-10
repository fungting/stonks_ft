import "../css/TransferForm.css";
import { push } from "connected-react-router";
import { Container, Row, Col } from "react-bootstrap";
import { env } from "../env";
import SwitchChianButton from "./SwitchChainButton";
import DepositForm from "./DepositForm";
import WithdrawalForm from "./WithdrawalForm";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../redux/store/state";
import { OnboardingButton } from "./OnboardingButton";

export default function TransferForm() {
	const dispatch = useDispatch();
	const account = useSelector((state: RootState) => state.metaMask.account);
	const chainId = useSelector((state: RootState) => state.metaMask.chainId);
	const { method } = useParams<{ method: string }>();

	if (!account) {
		return (
			<div className="connect">
				<h4 className="">Please connect MetaMask</h4>
				<OnboardingButton />
			</div>
		);
	}

	if (chainId !== 43113) {
		return (
			<>
				<div className="status-bar">
					<h5>Current Chain: {getChainName(chainId)}</h5>
					<span>Please switch to AVAX chain</span>
					{chainId !== 43113 && <SwitchChianButton />}
				</div>
			</>
		);
	}

	return (
		<Container className="transfer-form-container">
			<Row className="justify-content-center">
				<Col
					xs={3}
					className={"form-btn" + (method === "deposit" ? " active" : "")}
					onClick={() => dispatch(push("/transfer/deposit"))}
				>
					Deposit
				</Col>
				<Col
					xs={3}
					className={"form-btn" + (method === "withdrawal" ? " active" : "")}
					onClick={() => dispatch(push("/transfer/withdrawal"))}
				>
					Withdraw
				</Col>
			</Row>
			<Row className="justify-content-center">
				<Col xs={6} className="">
					{method === "deposit" && <DepositForm />}
					{method === "withdrawal" && <WithdrawalForm />}
				</Col>
			</Row>
			<Row className="justify-content-center import-bar">
				<Col xs={6} className="">
					<div>
						<div>Didn't see the token in MetaMask?</div>
						<button className="stonk-btn" onClick={addTokenAddress}>
							import here
						</button>
					</div>
				</Col>
			</Row>
		</Container>
	);
}

function getChainName(chainId: number) {
	if (chainId === 1) return "Ethereum Mainnet";
	if (chainId === 43113) return "Avalanche C-Chain";
	return "unknown";
}

async function addTokenAddress() {
	try {
		await window.ethereum.request({
			method: "wallet_watchAsset",
			params: {
				type: "ERC20",
				options: {
					address: "0x6baad065aa5173e16783d35f607265b5b2750264", // The address that the token is at.
					symbol: "STON", // A ticker symbol or shorthand, up to 5 chars.
					decimals: 18, // The number of decimals in the token
					image: `${env.url}/stonk_token.png`, // A string url of the token logo
				},
			},
		});
	} catch (error) {
		console.log(error);
	}
}
