import { Helmet } from "react-helmet";
import { Col, Container, Row } from "react-bootstrap";
import Sidebar from "./Sidebar";
import AddForm from "./AddForm";
import "../css/Watchlist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addStockThunk, deleteStockThunk, getAllWatchlistsThunk, getWatchlistThunk } from "../redux/watchlist/thunk";
import { RootState } from "../redux/store/state";
import StockTable from "./StockTable";
import { useParams } from "react-router-dom";
import { Stock } from "../redux/stock/state";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { push } from "connected-react-router";

export default function Watchlist() {
	const dispatch = useDispatch();
	const watchlists = useSelector((state: RootState) => state.watchlist.watchlists);
	const stocks = useSelector((state: RootState) => state.watchlist.stocks);
	const isLoading = useSelector((state: RootState) => state.watchlist.isLoading);
	const currentWatchlistId: number = Number(useParams<{ watchlistId: string }>().watchlistId);
	const currentWatchlistName = watchlists.find((watchlist) => watchlist.id === currentWatchlistId)?.name || "";
	const tableHeadings = ["Ticker", "Company Name", "Price", "Change", "Change %", ""];

	useEffect(() => {
		dispatch(getAllWatchlistsThunk());
	}, [dispatch]);

	useEffect(() => {
		if (watchlists.length > 0) {
			if (Number.isNaN(currentWatchlistId)) {
				dispatch(getWatchlistThunk(watchlists[0].id));
			} else {
				dispatch(getWatchlistThunk(currentWatchlistId));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, watchlists]);

	useEffect(() => {
		if (watchlists.length === 1 && currentWatchlistId !== watchlists[0].id) {
			dispatch(push(`/watchlist/${watchlists[0].id}`));
		}
	}, [dispatch, watchlists, currentWatchlistId]);

	const addStock = (ticker: string) => {
		return addStockThunk(currentWatchlistId, ticker.toUpperCase());
	};

	const watchlistTable = mapWatchlistTable(stocks, currentWatchlistId, currentWatchlistName, dispatch);

	return (
		<>
			<Helmet>
				<title>Watchlist | Stonks</title>
			</Helmet>
			<Container fluid className="watchlist-container">
				<Row>
					<Col md={3}>
						<Sidebar lists={watchlists} currentListId={currentWatchlistId} />
					</Col>
					<Col md={9}>
						<AddForm name={currentWatchlistName} placeholder="stock" onAdd={addStock} />
						<StockTable headings={tableHeadings} contents={watchlistTable} isLoading={isLoading} />
					</Col>
				</Row>
			</Container>
		</>
	);
}

function mapWatchlistTable(stocks: Stock[], watchlistId: number, watchlistName: string, dispatch: Function) {
	return stocks.map((stock, i: number) => {
		const deleteInfo = {
			watchlistId,
			stockId: stock.id,
			ticker: stock.ticker,
			watchlistName,
		};
		const change = stock.price - stock.prevPrice!;
		return (
			<tr key={i}>
				<td onClick={() => dispatch(push(`/stocks/${stock.ticker}`))}>{stock.ticker}</td>
				<td onClick={() => dispatch(push(`/stocks/${stock.ticker}`))}>{stock.name}</td>
				<td onClick={() => dispatch(push(`/stocks/${stock.ticker}`))}>{Number(stock.price).toFixed(2)}</td>
				<td onClick={() => dispatch(push(`/stocks/${stock.ticker}`))}>{change.toFixed(2)}</td>
				<td onClick={() => dispatch(push(`/stocks/${stock.ticker}`))}>
					{((change / stock.prevPrice!) * 100).toFixed(2) + "%"}
				</td>
				<td>
					<FontAwesomeIcon
						icon={faTimes as IconProp}
						onClick={() => dispatch(deleteStockThunk(deleteInfo))}
					/>
				</td>
			</tr>
		);
	});
}
