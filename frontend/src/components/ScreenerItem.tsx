import "../css/ScreenerItem.css";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup, Col, Form, ListGroup, Row, ToggleButton } from "react-bootstrap";
import { Dispatch, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";
import { getIndustriesThunk, getSectorsThunk } from "../redux/screener/thunk";
import { addItemAction, removeItemAction, resetItemAction } from "../redux/screener/action";
import { Item } from "../redux/screener/state";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type Props = {
	radioIndustry: string;
	radioSector: string;
	setRadioIndustry: Dispatch<string>;
	setRadioSector: Dispatch<string>;
};

export default function ScreenerItem({ radioIndustry, radioSector, setRadioIndustry, setRadioSector }: Props) {
	const dispatch = useDispatch();
	const sectors = useSelector((state: RootState) => state.screener.sectors);
	const industries = useSelector((state: RootState) => state.screener.industries);
	const addedSectors = useSelector((state: RootState) => state.screener.addedSectors);
	const addedIndustries = useSelector((state: RootState) => state.screener.addedIndustries);
	const radioButtons = [
		{ value: "include", className: "outline-success" },
		{ value: "exclude", className: "outline-danger" },
	];

	function addSector(sector: Item) {
		if (addedSectors.filter((addedSector) => addedSector.id === sector.id).length === 0)
			dispatch(addItemAction("addedSectors", sector, radioSector));
	}

	function addIndustry(industry: Item) {
		if (addedIndustries.filter((addedIndustry) => addedIndustry.id === industry.id).length === 0)
			dispatch(addItemAction("addedIndustries", industry, radioIndustry));
	}

	function resetSector(e: any) {
		setRadioSector("include");
		dispatch(resetItemAction("addedSectors"));
	}

	function resetIndustry(e: any) {
		setRadioIndustry("include");
		dispatch(resetItemAction("addedIndustries"));
	}

	useEffect(() => {
		dispatch(getIndustriesThunk());
		dispatch(getSectorsThunk());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Row>
			<Col md={6}>
				<div className="stonk-btn-container">
					<h4>Sector</h4>
					<ButtonGroup>
						{radioButtons.map((btn) => (
							<ToggleButton
								key={btn.value}
								type="radio"
								value={btn.value}
								variant={btn.className}
								name="sector"
								checked={radioSector === btn.value}
								onClick={() => setRadioSector(btn.value)}
							>
								{btn.value[0].toUpperCase() + btn.value.substring(1, btn.value.length)}
							</ToggleButton>
						))}
						<button className="stonk-btn reset-btn" onClick={resetSector}>
							Reset
						</button>
					</ButtonGroup>
				</div>
				<Form.Group className="screener-items">
					<ListGroup className="screen-list">
						{sectors.map((sector) => (
							<ListGroup.Item key={sector.id} onClick={() => addSector(sector)}>
								{sector.name}
							</ListGroup.Item>
						))}
					</ListGroup>
					<FontAwesomeIcon icon={faArrowRight as IconProp} />
					<ListGroup className="screen-list">
						{addedSectors.map((sector, i) => (
							<ListGroup.Item
								key={i}
								variant={sector.isInclude ? "success" : "danger"}
								onClick={() => dispatch(removeItemAction(sector, "addedSectors"))}
							>
								{sector.name}
							</ListGroup.Item>
						))}
					</ListGroup>
				</Form.Group>
			</Col>
			<Col md={6}>
				<div className="stonk-btn-container">
					<h4>Industry</h4>
					<ButtonGroup>
						{radioButtons.map((btn) => (
							<ToggleButton
								key={btn.value}
								type="radio"
								value={btn.value}
								variant={btn.className}
								name="industry"
								checked={radioIndustry === btn.value}
								onClick={() => setRadioIndustry(btn.value)}
							>
								{btn.value[0].toUpperCase() + btn.value.substring(1, btn.value.length)}
							</ToggleButton>
						))}
						<button className="stonk-btn reset-btn" onClick={resetIndustry}>
							Reset
						</button>
					</ButtonGroup>
				</div>
				<Form.Group className="screener-items">
					<ListGroup className="screen-list">
						{industries.map((industry) => (
							<ListGroup.Item key={industry.id} onClick={() => addIndustry(industry)}>
								{industry.name}
							</ListGroup.Item>
						))}
					</ListGroup>
					<FontAwesomeIcon icon={faArrowRight as IconProp} />
					<ListGroup className="screen-list">
						{addedIndustries.map((industry, i) => (
							<ListGroup.Item
								key={i}
								variant={industry.isInclude ? "success" : "danger"}
								onClick={() => dispatch(removeItemAction(industry, "addedIndustries"))}
							>
								{industry.name}
							</ListGroup.Item>
						))}
					</ListGroup>
				</Form.Group>
			</Col>
		</Row>
	);
}
