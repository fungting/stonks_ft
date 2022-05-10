import "../css/LoadingSpinner.css";
import { RingLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/state";

export default function LoadingSpinner() {
	const theme = useSelector((state: RootState) => state.theme.theme);

	return (
		<div className="loading">
			<RingLoader color={theme === "light" ? "#0000AC" : "rgba(255,255,255,0.8)"} />
		</div>
	);
}
