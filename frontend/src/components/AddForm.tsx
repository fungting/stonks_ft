import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import "../css/AddForm.css";

type Props = {
	name: string;
	placeholder: string;
	onAdd: (content: string) => void;
};

export default function AddForm({ name, placeholder, onAdd }: Props) {
	const [content, setContent] = useState("");
	const [isRotate, setIsRotate] = useState(false);
	const dispatch = useDispatch();

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch(onAdd(content));
		setContent("");
	};

	return (
		<>
			<div className="form-heading">
				<h2>{name}</h2>
				{/* <div className={isRotate ? "rotate" : ""} onClick={() => setIsRotate(!isRotate)}>
					+
				</div> */}
				<FontAwesomeIcon
					icon={faPlus as IconProp}
					className={isRotate ? "rotate" : ""}
					onClick={() => setIsRotate(!isRotate)}
				/>
			</div>
			{isRotate && (
				<Form onSubmit={onSubmit} className="add-form">
					<Form.Control
						type="text"
						placeholder={`add ${placeholder}`}
						onChange={(e) => setContent(e.target.value)}
						value={content}
					/>
					<button className="submit-btn" type="submit">
						Add
					</button>
				</Form>
			)}
		</>
	);
}
