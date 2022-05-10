import { useEffect, useState } from "react";
import { Form, Offcanvas } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { env } from "../env";
import { getBalanceThunk } from "../redux/auth/thunk";
import { buyStockThunk, getSharesThunk } from "../redux/stock/thunk";
import { RootState } from "../redux/store/state";
import { defaultErrorSwal } from "./ReactSwal";

type Props = {
	setIsShow: (isShow: boolean) => void;
};

export type BuyFormState = {
	shares: number;
};

export default function BuyOffcanvas({ setIsShow }: Props) {
	const dispatch = useDispatch();
	const theme = useSelector((state: RootState) => state.theme.theme);
	const user = useSelector((state: RootState) => state.auth.user);
	const cash = useSelector((state: RootState) => state.auth.balance.cash);
	const stock = useSelector((state: RootState) => state.stock.stock);
	const shares = useSelector((state: RootState) => state.stock.shares);
	const { ticker } = useParams<{ ticker: string }>();
	const [price, setPrice] = useState(0);
	const { register, handleSubmit, setValue, watch, reset } = useForm<BuyFormState>({ defaultValues: { shares: 0 } });
	const hideOffcanvas = () => setIsShow(false);

	function onSubmit(data: BuyFormState) {
		if (data.shares * price > cash) defaultErrorSwal("Not enough cash");
		if (data.shares > 0) {
			dispatch(buyStockThunk(ticker, data.shares, price));
			reset();
		}
	}

	function validateValue(e: any) {
		const shares = Number(e.target.value);
		if (shares <= 0) {
			setValue("shares", 0);
		} else {
			setValue("shares", Number(shares.toFixed(2)));
		}
	}

	useEffect(() => {
		if (stock?.price) {
			setPrice(Number(stock?.price));
		}
	}, [stock]);

	useEffect(() => {
		if (user?.payload) {
			dispatch(getBalanceThunk());
		}
	}, [dispatch, user]);

	useEffect(() => {
		if (user?.payload) {
			dispatch(getSharesThunk(ticker));
		}
	}, [dispatch, user, ticker]);

	useEffect(() => {
		const socket = new WebSocket(`wss://ws.finnhub.io?token=${env.finnhubKey}`);

		socket.addEventListener("open", (e) => {
			if (stock?.sectorName?.toLowerCase() === "crypto".toLowerCase()) {
				socket.send(JSON.stringify({ type: "subscribe", symbol: `BINANCE:${ticker}USDT` }));
			} else {
				socket.send(JSON.stringify({ type: "subscribe", symbol: ticker }));
			}
		});

		socket.addEventListener("message", (e) => {
			const data = JSON.parse(e.data);
			if (data.data) {
				const socketPrice = data.data.at(-1).p;
				setPrice(socketPrice);
			}
		});

		return () => {
			socket.addEventListener("open", () => {
				if (stock?.sectorName?.toLowerCase() === "crypto".toLowerCase()) {
					socket.send(JSON.stringify({ type: "unsubscribe", symbol: `BINANCE:${ticker}USDT` }));
				} else {
					socket.send(JSON.stringify({ type: "unsubscribe", symbol: ticker }));
				}
			});
			socket.close();
		};
	}, [ticker, stock]);

	const totalCost = price * watch("shares");

	return (
		<Offcanvas
			show={true}
			onHide={hideOffcanvas}
			placement="end"
			backdrop={false}
			scroll
			className={"buy-order " + theme}
		>
			<Offcanvas.Header closeButton className="order-header">
				<Offcanvas.Title>BUY</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<div className="title-row">
					<span>{ticker}</span>
					<span>{stock?.name}</span>
				</div>
				<h3>{price.toFixed(2)}</h3>
				<div>Cash BP: ${cash.toFixed(2)}</div>
				<div>You own: {shares}</div>
				<span>QUANTITY</span>
				<div className="input-row">
					<Form onSubmit={handleSubmit(onSubmit)} id="buy-form">
						<Form.Control
							{...register("shares", { valueAsNumber: true })}
							type="number"
							placeholder="shares"
							onBlur={validateValue}
							min="0"
						/>
					</Form>
					<div>Shares</div>
				</div>
				<div className="cost-row">{Number.isNaN(totalCost) ? "" : `Total: ${totalCost.toFixed(2)}`}</div>
				<button type="submit" className="stonk-btn trade-btn" form="buy-form">
					Buy
				</button>
			</Offcanvas.Body>
		</Offcanvas>
	);
}
