import "../css/WatchlistModal.css";
import { useEffect, useState } from "react";
import { ListGroup, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../redux/store/state";
import { addStockThunk, getAllWatchlistsThunk } from "../redux/watchlist/thunk";

type Props = {
	isShow: boolean;
	setIsShow: (isShow: boolean) => void;
};

export default function WatchlistModal({ isShow, setIsShow }: Props) {
	const dispatch = useDispatch();
	const watchlists = useSelector((state: RootState) => state.watchlist.watchlists);
	const user = useSelector((state: RootState) => state.auth.user);
	const [watchlistId, setWatchlistId] = useState(0);
	const { ticker } = useParams<{ ticker: string }>();
	const hideModal = () => setIsShow(false);
	const addStock = () => {
		dispatch(addStockThunk(watchlistId, ticker));
		setWatchlistId(0);
		setIsShow(false);
	};

	useEffect(() => {
		if (user) {
			dispatch(getAllWatchlistsThunk());
		}
	}, [dispatch, user]);

	return (
		<Modal show={isShow} onHide={hideModal} centered>
			<Modal.Header closeButton>
				<Modal.Title>Add to Watchlist</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<ListGroup>
					{watchlists.length > 0 &&
						watchlists.map(({ id, name }) => (
							<ListGroup.Item
								className={watchlistId === id ? "active" : ""}
								onClick={() => setWatchlistId(id)}
								key={id}
							>
								{name}
							</ListGroup.Item>
						))}
				</ListGroup>
			</Modal.Body>
			<Modal.Footer>
				<button className="stonk-btn trade-btn" onClick={addStock}>
					Add
				</button>
			</Modal.Footer>
		</Modal>
	);
}
