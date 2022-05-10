import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";
import { useForm } from "react-hook-form";
import { depositThunk } from "../redux/metaMask/thunk";
import { useEffect } from "react";
import { getBalanceThunk } from "../redux/auth/thunk";

export type DepositFormState = {
	deposit: number;
};

export default function DepositForm() {
	const dispatch = useDispatch();
	const token = useSelector((state: RootState) => state.metaMask.token);
	const isLoading = useSelector((state: RootState) => state.metaMask.isLoading);
	const cash = useSelector((state: RootState) => state.auth.balance.cash);
	const { watch, handleSubmit, register, reset, setValue } = useForm<DepositFormState>({
		defaultValues: { deposit: 0 },
	});

	function onSubmit(data: DepositFormState) {
		const deposit = Number(data.deposit);
		if (deposit > 0 && token !== null) {
			dispatch(depositThunk(deposit, reset));
		}
	}

	function validateValue(e: any) {
		const value = Number(e.target.value);
		if (value <= 0) setValue("deposit", 0);
		else if (token !== null && value >= token) setValue("deposit", token);
		else setValue("deposit", Number(value.toFixed(2)));
	}

	useEffect(() => {
		dispatch(getBalanceThunk());
	}, [dispatch]);

	return (
		<Form id="transfer-form" onSubmit={handleSubmit(onSubmit)}>
			<Row>
				<Col>
					<Form.Group>Token available for deposit: {token} STON</Form.Group>
					<Form.Group>Current balance: {cash} USD</Form.Group>
					<Form.Group>
						<Form.Label>Deposit Amount</Form.Label>
					</Form.Group>
					<Form.Group className="transfer-input">
						<Form.Control
							type="number"
							{...register("deposit", { valueAsNumber: true })}
							min="0"
							max={token !== null ? token : 0}
							onBlur={validateValue}
						/>
						<span>STON</span>
						<span>= {watch("deposit") > 0 ? watch("deposit") : 0} USD</span>
					</Form.Group>
					<Form.Group>
						Total: {Number.isNaN(watch("deposit")) ? cash : cash + watch("deposit")} USD
					</Form.Group>
					<button className="stonk-btn" type="submit" disabled={isLoading}>
						{isLoading ? "Loading" : "Deposit"}
					</button>
				</Col>
			</Row>
		</Form>
	);
}
