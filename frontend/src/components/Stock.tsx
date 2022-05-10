import "../css/Stock.css";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";
import { useParams } from "react-router-dom";
import StockButtons from "./StockButtons";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { getCommentsThunk, getStockNewsThunk, getStockThunk } from "../redux/stock/thunk";
import { localTime } from "../helper";
import Comments from "./Comments";
import { AdvancedChart, FundamentalData, SymbolInfo } from "react-tradingview-embed";

export default function Stock() {
	const dispatch = useDispatch();
	const theme = useSelector((state: RootState) => state.theme.theme);
	const stock = useSelector((state: RootState) => state.stock.stock);
	const news = useSelector((state: RootState) => state.stock.news);
	const { ticker } = useParams<{ ticker: string }>();

	useEffect(() => {
		dispatch(getStockThunk(ticker));
		dispatch(getStockNewsThunk(ticker));
	}, [dispatch, ticker]);

	useEffect(() => {
		if (stock) {
			dispatch(getCommentsThunk(stock.id));
		}
	}, [dispatch, stock]);

	return (
		<>
			<Helmet>
				<title> {ticker} | Stonks </title>
			</Helmet>
			<Container fluid className="stock-container">
				<Row>
					<Col md={8} className="stock-info">
						<SymbolInfo widgetProps={{ symbol: ticker, colorTheme: theme, width: "100%" }} />
					</Col>
				</Row>
				<Row>
					<Col md={8}>
						<div className="stock-graph">
							<AdvancedChart
								widgetProps={{
									symbol: ticker,
									theme: theme,
									interval: "D",
									allow_symbol_change: false,
									hide_side_toolbar: true,
									save_image: false,
									withdateranges: false,
								}}
							/>
						</div>
						<FundamentalData widgetProps={{ symbol: ticker, colorTheme: theme, width: "100%" }} />
					</Col>
					<Col md={4}>
						<StockButtons />
						<div className="news-container">
							<h3>News</h3>
							<div className="news-section">
								{news.map((news) => (
									<div className="news-wrap" key={news.uuid}>
										<div className="news-title">
											<a href={news.link}>{news.title}</a>
										</div>
										<div className="news-date">{localTime(news.providerPublishTime)}</div>
									</div>
								))}
							</div>
						</div>
						<Comments />
					</Col>
				</Row>
			</Container>
		</>
	);
}
