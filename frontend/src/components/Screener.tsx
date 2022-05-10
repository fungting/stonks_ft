import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import StockTable from "./StockTable";
import ScreenerForm from "./ScreenerForm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";
import { push } from "connected-react-router";
import { IScreener } from "../redux/screener/state";

export default function Screener() {
	const dispatch = useDispatch();
	const stocks = useSelector((state: RootState) => state.screener.stocks);
	const isLoading = useSelector((state: RootState) => state.screener.isLoading);
	const tableHeadings: string[] = [
		"TICKER",
		"COMPANY",
		"PRICE ($)",
		"CHANGE ($)",
		"CHANGE %",
		"52 WEEKS HIGH ($)",
		"MARKET CAP (MIL)",
		"RS RATING",
		"SECTOR",
		"INDUSTRY",
		"INDUSTRY RS",
		"INDUSTRY RANK",
	];

	function mapStockTable(stock: IScreener, i: number) {
		return (
			<tr key={i} onClick={() => dispatch(push(`/stocks/${stock.ticker}`))}>
				<td>{stock.ticker}</td>
				<td>{stock.name}</td>
				<td>{stock.price}</td>
				<td className={Number(stock.change) > 0 ? "positive" : Number(stock.change) < 0 ? "negative" : ""}>
					{stock.change}
				</td>
				<td
					className={Number(stock.changePer) > 0 ? "positive" : Number(stock.changePer) < 0 ? "negative" : ""}
				>
					{stock.changePer}
				</td>
				<td>{stock.yearHigh}</td>
				<td>{stock.marketCap}</td>
				<td>{stock.rsRating}</td>
				<td>{stock.sector}</td>
				<td>{stock.industry}</td>
				<td>{stock.industryRs}</td>
				<td>{stock.industryRank}</td>
			</tr>
		);
	}
	const screenerTable = stocks.map(mapStockTable);
	return (
		<>
			<Helmet>
				<title>Screener | Stonks</title>
			</Helmet>
			<Container>
				<ScreenerForm />
			</Container>
			<Container fluid>
				<StockTable headings={tableHeadings} contents={screenerTable} isLoading={isLoading} />
			</Container>
		</>
	);
}
