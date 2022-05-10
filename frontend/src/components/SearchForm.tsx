import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { push } from "connected-react-router";
import { FormEvent, useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import "../css/SearchForm.css";

export function SearchForm() {
	const [ticker, setTicker] = useState("");
	const dispatch = useDispatch();

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch(push(`/stocks/${ticker}`));
		setTicker('')
	};

	return (
		<Form onSubmit={onSubmit} className="search-form">
				<Form.Control
					type="search"
					placeholder="Enter a symbol"
					name="tickerInput"
					value={ticker}
					onChange={(e) => setTicker(e.target.value.toUpperCase())}
				/>
			<button type="submit" className="search-btn">
				<FontAwesomeIcon icon={faSearch as IconProp} className="" />
			</button>
		</Form>
	);
}
