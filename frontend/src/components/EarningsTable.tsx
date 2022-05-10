import { Table } from "react-bootstrap";

type Props = {
	contents: JSX.Element[];
};

export default function EarningsTable({ contents }: Props) {
	const headings = [
		"date",
		"ticker",
		"company",
		"year",
		"quarter",
		"EPS estimated",
		"EPS reported",
		"EPS surprise",
		"Revenue Estimated (Mil)",
		"Revenue Reported (Mil)",
		"Revenue surprise",
	];

	return (
		<Table responsive hover className="stock-table">
			<thead>
				<tr>
					{headings.map((heading, i) => (
						<th key={heading} className={i > 2 ? "number" : ""}>
							{heading}
						</th>
					))}
				</tr>
			</thead>
			<tbody>{contents.map((content) => content)}</tbody>
		</Table>
	);
}
