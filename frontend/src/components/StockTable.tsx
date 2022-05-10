import "../css/StockTable.css";
import { Table } from "react-bootstrap";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
	headings: string[];
	contents: JSX.Element[] | JSX.Element;
	isLoading: boolean;
};

function StockTable({ headings, contents, isLoading }: Props) {

	return (
		<Table responsive hover className="stock-table">
			<thead>
				<tr>
					{headings.map((heading) => (
						<th key={heading}>{heading}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{isLoading ? (
					<tr className="loading-container">
						<LoadingSpinner />
					</tr>
				) : (
					contents
				)}
			</tbody>
		</Table>
	);
}

export default StockTable;
