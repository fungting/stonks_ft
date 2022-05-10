import { RootDispatch } from "../store/action";
import { getNewsAction, loadingNewsAction } from "./action";

export function getNewsThunk() {
	return async (dispatch: RootDispatch) => {
		dispatch(loadingNewsAction());
		try {
			const res = await fetch(
				"https://seeking-alpha.p.rapidapi.com/news/v2/list-trending?until=0&since=0&size=7",
				{
					method: "GET",
					headers: {
						"x-rapidapi-host": "seeking-alpha.p.rapidapi.com",
						"x-rapidapi-key": "eb76c9b688msha0363b0bcc4e8d8p1f0147jsn4c17370cbe91",
					},
				}
			);
			const result = await res.json();
			if (res.ok) {
				const news = result.data;
				dispatch(getNewsAction(news));
			} else {
				dispatch(getNewsAction([]));
			}
		} catch (error) {
			console.log(error);
		}
	};
}
