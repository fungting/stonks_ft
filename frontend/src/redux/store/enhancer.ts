import { routerMiddleware } from "connected-react-router";
import { history } from "./history";
import { compose, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

declare global {
	/* tslint:disable:interface-name */
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
		ethereum?: any;
	}
}

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let rootEnhancer: any;

if (window.location.origin === "http://localhost:3000") {
	rootEnhancer = composeEnhancer(
		applyMiddleware(logger),
		applyMiddleware(thunk),
		applyMiddleware(routerMiddleware(history))
	);
} else {
	rootEnhancer = composeEnhancer(applyMiddleware(thunk), applyMiddleware(routerMiddleware(history)));
}

export default rootEnhancer;
