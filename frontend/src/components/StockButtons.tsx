import "../css/StockButtons.css";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useState } from "react";
import WatchlistModal from "./WatchlistModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";
import { push } from "connected-react-router";
import BuyModal from "./BuyModal";
import SellModal from "./SellModal";
import NotiModal from "./NotiModal";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export default function StockButtons() {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.auth.user);
	const [isShowBuy, setIsShowBuy] = useState(false);
	const [isShowSell, setIsShowSell] = useState(false);
	const [isShowWatchlist, setIsShowWatchlist] = useState(false);
	const [isShowNoti, setIsShowNoti] = useState(false);

	function setIsShow(fn: Dispatch<SetStateAction<boolean>>) {
		if (user) {
			fn(true);
		} else {
			dispatch(push("/login"));
		}
	}

	const buttons = [
		{ name: "Buy", className: "buy-btn", fn: setIsShowBuy },
		{ name: "Sell", className: "sell-btn", fn: setIsShowSell },
		{ name: "Watchlist", className: "watchlist-btn", fn: setIsShowWatchlist },
		{ name: <FontAwesomeIcon icon={faBell as IconProp} />, className: "noti-btn", fn: setIsShowNoti },
	];

	return (
		<>
			<div className="button-container">
				{buttons.map(({ name, className, fn }) => (
					<button className={className} onClick={() => setIsShow(fn)} key={className}>
						{name}
					</button>
				))}
			</div>
			{isShowBuy && <BuyModal setIsShow={setIsShowBuy} />}
			{isShowSell && <SellModal setIsShow={setIsShowSell} />}
			<WatchlistModal isShow={isShowWatchlist} setIsShow={setIsShowWatchlist} />
			<NotiModal isShow={isShowNoti} setIsShow={setIsShowNoti} />
		</>
	);
}
