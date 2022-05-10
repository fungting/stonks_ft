import "../css/ScreenerForm.css";
import { Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loadScreenResultThunk } from "../redux/screener/thunk";
import { RootState } from "../redux/store/state";
import { resetScreenerAction } from "../redux/screener/action";
import ScreenerItem from "./ScreenerItem";
import { useState } from "react";

export type FormState = {
	minPrice: number;
	maxPrice: number;
	minWeekPercent: number;
	maxWeekPercent: number;
	minMarketCap: number;
	maxMarketCap: number;
	minRS: number;
	maxRS: number;
	minIndustryRS: number;
	maxIndustryRS: number;
	minIndustryRank: number;
	maxIndustryRank: number;
};

type Input = {
	title: string;
	name: string;
	min: number;
	max: number;
};

export default function ScreenerForm() {
	const dispatch = useDispatch();
	const addedIndustries = useSelector((state: RootState) => state.screener.addedIndustries);
	const addedSectors = useSelector((state: RootState) => state.screener.addedSectors);
	const stocks = useSelector((state: RootState) => state.screener.stocks);
	const [radioSector, setRadioSector] = useState("include");
	const [radioIndustry, setRadioIndustry] = useState("include");
	const defaultValues = {
		minPrice: 0,
		maxPrice: 1000000,
		minWeekPercent: 0,
		maxWeekPercent: 100,
		minMarketCap: 0,
		maxMarketCap: 5000000,
		minRS: 0,
		maxRS: 100,
		minIndustryRS: 0,
		maxIndustryRS: 100,
		minIndustryRank: 1,
		maxIndustryRank: 197,
	};
	const { register, handleSubmit, reset, setValue, watch } = useForm<FormState>({ defaultValues });
	const inputsArr: Input[][] = [
		[
			{ title: "Price ($)", name: "price", min: 0, max: 1000000 },
			{ title: "% Off 52-week High", name: "weekPercent", min: 0, max: 100 },
			{ title: "Market Capitalization (Mil)", name: "marketCap", min: 0, max: 5000000 },
		],
		[
			{ title: "RS Rating (0-100)", name: "rS", min: 0, max: 100 },
			{ title: "Industry RS Rating (0-100)", name: "industryRS", min: 0, max: 100 },
			{ title: "Industry Ranking (1-197)", name: "industryRank", min: 1, max: 197 },
		],
	];

	function onSubmit(data: FormState) {
		dispatch(loadScreenResultThunk(data, addedIndustries, addedSectors));
	}

	function validateValue(e: any) {
		const name = e.target.name as keyof FormState;
		const value = Number(e.target.value);
		const key = name.substring(3);
		const minKey = ("min" + key) as keyof FormState;
		const maxKey = ("max" + key) as keyof FormState;
		const minValue = watch(minKey);
		const maxValue = watch(maxKey);
		if (value <= defaultValues[minKey]) setValue(name, defaultValues[minKey]);
		if (value >= defaultValues[maxKey]) setValue(name, defaultValues[maxKey]);
		if (name.match(/min/) && value > maxValue) setValue(name, maxValue);
		if (name.match(/max/) && value < minValue) setValue(name, minValue);
	}

	function resetForm() {
		reset();
		dispatch(resetScreenerAction());
		setRadioSector("include");
		setRadioIndustry("include");
	}

	return (
		<>
			<Form id="screener-form" onSubmit={handleSubmit(onSubmit)}>
				<Row>
					{inputsArr.map((inputs, i) => (
						<Col lg={6} key={i}>
							{inputs.map(({ title, name, min, max }) => (
								<Form.Group className="screener-items" key={name}>
									<h4>{title}</h4>
									<div>
										<Form.Control
											{...register(
												`min${name[0].toUpperCase() + name.substring(1)}` as keyof FormState,
												{ valueAsNumber: true }
											)}
											type="number"
											placeholder="min"
											min={min}
											max={max}
											onBlur={validateValue}
										/>
										<span>to</span>
										<Form.Control
											{...register(
												`max${name[0].toUpperCase() + name.substring(1)}` as keyof FormState,
												{ valueAsNumber: true }
											)}
											type="number"
											placeholder="max"
											min={min}
											max={max}
											onBlur={validateValue}
										/>
									</div>
								</Form.Group>
							))}
						</Col>
					))}
				</Row>
			</Form>
			<ScreenerItem
				radioIndustry={radioIndustry}
				radioSector={radioSector}
				setRadioIndustry={setRadioIndustry}
				setRadioSector={setRadioSector}
			/>
			<Row className="screen-result">
				<Col xs={6}>
					<h4>Number of stocks found: {stocks.length}</h4>
				</Col>
				<Col xs={4}>
					<button type="submit" className="stonk-btn result-btn" form="screener-form">
						View Screen Results
					</button>
				</Col>
				<Col xs={2}>
					<button className="stonk-btn result-btn" onClick={() => resetForm()}>
						Reset
					</button>
				</Col>
			</Row>
		</>
	);
}
