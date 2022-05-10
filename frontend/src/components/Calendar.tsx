import "../css/Calendar.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";
import { useEffect } from "react";
import { getAllEarningsThunk, getEarningsTableThunk } from "../redux/calendar/thunk";
import { EarningTable } from "../redux/calendar/state";
import EarningsTable from "./EarningsTable";
import { push } from "connected-react-router";
import { Helmet } from "react-helmet";

export default function Calendar() {
	const dispatch = useDispatch();
	const allEarnings = useSelector((state: RootState) => state.calendar.all);
	const todayEarnings = useSelector((state: RootState) => state.calendar.today);
	const pastEarnings = useSelector((state: RootState) => state.calendar.past);
	const nextEarnings = useSelector((state: RootState) => state.calendar.next);

	useEffect(() => {
		dispatch(getAllEarningsThunk());
		dispatch(getEarningsTableThunk());
	}, [dispatch]);

	const earningCalendar = allEarnings.map(({ createdAt, ticker, releaseTime }) => ({
		date: createdAt,
		title: `${ticker} (${releaseTime})`,
		allDay: true,
	}));
	const todayEarningTable = todayEarnings.map(mapEarningTable);
	const pastEarningTable = pastEarnings.map(mapEarningTable);
	const nextEarningTable = nextEarnings.map(mapEarningTable);

	function mapEarningTable(
		{
			createdAt,
			ticker,
			name,
			year,
			quarter,
			epsEstimated,
			epsReported,
			revenueEstimated,
			revenueReported,
		}: EarningTable,
		i: number
	) {
		const epsSurprise = epsReported
			? ((Number(epsReported) - Number(epsEstimated)) / Number(epsEstimated)) * 100
			: null;
		const revenueSurprise = revenueReported
			? ((Number(revenueReported) - Number(revenueEstimated)) / Number(revenueEstimated)) * 100
			: null;
		return (
			<tr key={i} onClick={() => dispatch(push(`/stocks/${ticker}`))}>
				<td className={""}>{createdAt.split("T")[0]}</td>
				<td className={""}>{ticker}</td>
				<td className={""}>{name}</td>
				<td className={"number"}>{year}</td>
				<td className={"number"}>{quarter}</td>
				<td className={"number"}>{epsEstimated}</td>
				<td className={"number"}>{epsReported}</td>
				<td className={"number " + (epsSurprise && epsSurprise > 0 ? "positive" : "negative")}>
					{epsSurprise !== null && epsSurprise.toFixed(2) + "%"}
				</td>
				<td className={"number"}>
					{Number(revenueEstimated).toLocaleString(undefined, { minimumFractionDigits: 2 })}
				</td>
				<td className={"number"}>
					{revenueReported
						? Number(revenueReported).toLocaleString(undefined, { minimumFractionDigits: 2 })
						: null}
				</td>
				<td className={"number " + (revenueSurprise && revenueSurprise > 0 ? "positive" : "negative")}>
					{revenueSurprise !== null && revenueSurprise.toFixed(2) + "%"}
				</td>
			</tr>
		);
	}

	return (
		<>
			<Helmet>
				<title>Calendar | Stonks</title>
			</Helmet>
			<Container>
				<div className="calendar">
					<FullCalendar
						plugins={[dayGridPlugin]}
						events={earningCalendar}
						eventClick={(event) => {
							const ticker = event.event.title.split("(")[0];
							dispatch(push(`/stocks/${ticker}`));
						}}
					/>
				</div>
			</Container>
			<Container fluid className="calendar-container">
				<h4>Today's Earnings Releases</h4>
				<EarningsTable contents={todayEarningTable} />
				<h4>Earnings Releases in the past 10 days</h4>
				<EarningsTable contents={pastEarningTable} />
				<h4>Upcoming Earning Releases in the next 10 days</h4>
				<EarningsTable contents={nextEarningTable} />
			</Container>
		</>
	);
}
