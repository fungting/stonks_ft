import { useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getBalanceThunk } from "../redux/auth/thunk";
import { withdrawalThunk } from "../redux/metaMask/thunk";
import { RootState } from "../redux/store/state";
import { defaultErrorSwal } from "./ReactSwal";

export type WithdrawalFormState = {
	withdrawal: number;
};

export default function WithdrawalForm() {
	const dispatch = useDispatch();
	const account = useSelector((state: RootState) => state.metaMask.account);
	const token = useSelector((state: RootState) => state.metaMask.token);
	const isLoading = useSelector((state: RootState) => state.metaMask.isLoading);
	const cash = useSelector((state: RootState) => state.auth.balance.cash);
	const { watch, handleSubmit, register, reset, setValue } = useForm<WithdrawalFormState>({
		defaultValues: { withdrawal: 0 },
	});

	function onSubmit(data: WithdrawalFormState) {
		const { withdrawal } = data;
		if (withdrawal > 0) {
			if (cash - withdrawal > 0) {
				dispatch(withdrawalThunk(account, withdrawal.toString(), reset));
			} else {
				defaultErrorSwal("Not enough cash");
			}
		}
	}

	function validateValue(e: any) {
		const value = Number(e.target.value);
		if (value <= 0) setValue("withdrawal", 0);
		else if (value >= cash) setValue("withdrawal", cash);
		else setValue("withdrawal", Number(value.toFixed(2)));
	}

	useEffect(() => {
		dispatch(getBalanceThunk());
	}, [dispatch]);

	return (
		<Form id="transfer-form" onSubmit={handleSubmit(onSubmit)}>
			<Row>
				<Col>
					<Form.Group>Current balance for withdrawal: {cash} USD</Form.Group>
					<Form.Group>You Own: {token} STON</Form.Group>
					<Form.Group>
						<Form.Label>Withdrawal Amount</Form.Label>
					</Form.Group>
					<Form.Group className="transfer-input">
						<Form.Control
							type="number"
							{...register("withdrawal", { valueAsNumber: true })}
							min="0"
							max={cash}
							onBlur={validateValue}
						/>
						<span>USD</span>
						<span>= {watch("withdrawal") > 0 ? watch("withdrawal") : 0} STON</span>
					</Form.Group>
					<Form.Group>Total: {token !== null && token + watch("withdrawal")} STON</Form.Group>
					<button className="stonk-btn" type="submit" disabled={isLoading}>
						{isLoading ? "Loading" : "Withdrawal"}
					</button>
				</Col>
			</Row>
		</Form>
	);
}
