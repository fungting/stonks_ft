import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { RootState } from "../redux/store/state";
import Calendar from "./Calendar";
import Footer from "./Footer";
import Home from "./Home";
import NoMatch from "./NoMatch";
import Portfolio from "./Portfolio";
import PowerBI from "./PowerBI";
import PrivateRoute from "./PrivateRoute";
import Screener from "./Screener";
import Stock from "./Stock";
import NavBar from "./TopNavbar";
import Transfer from "./Transfer";
import Watchlist from "./Watchlist";

export default function DefaultContainer() {
	const theme = useSelector((state: RootState) => state.theme.theme);

	return (
		<div className={theme} id="app">
			<NavBar />
			<main>
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/stocks/:ticker" component={Stock} />
					<PrivateRoute path="/watchlist/:watchlistId?" component={Watchlist} />
					<Route path="/screener" component={Screener} />
					<PrivateRoute path="/portfolio" component={Portfolio} />
					<PrivateRoute path="/transfer/:method" component={Transfer} />
					<Route path="/dashboard" component={PowerBI} />
					<Route path="/calendar" component={Calendar} />
					<Redirect from="/transfer" to="/transfer/deposit" />
					<Route component={NoMatch} />
				</Switch>
			</main>
			<Footer />
		</div>
	);
}
