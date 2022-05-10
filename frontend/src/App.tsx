import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./redux/store/history";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import DefaultContainer from "./components/DefaultContainer";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store/state";
import { TickerTape } from "react-tradingview-embed";

function App() {
	const theme = useSelector((state: RootState) => state.theme.theme);

	return (
		<ConnectedRouter history={history}>
			<div className="tape-section">
				<TickerTape widgetProps={{ colorTheme: theme, displayMode: "regular" }} />
			</div>
			<Switch>
				<Route path="/login" exact component={Login} />
				<Route component={DefaultContainer} />
			</Switch>
		</ConnectedRouter>
	);
}

export default App;
