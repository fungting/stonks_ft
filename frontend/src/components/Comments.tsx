import CommentForm from "./CommentForm";
import { localTime } from "../helper";
import { useSelector } from "react-redux";
import { env } from "../env";
import { RootState } from "../redux/store/state";

export default function Comments() {
	const comments = useSelector((state: RootState) => state.stock.comments);

	return (
		<div className="comment-container">
			<h3>Comments</h3>
			<div className="comment-section">
				{comments.map((comment, i) => (
					<div className="comment-wrap" key={i}>
						<img className="avatar" src={`${env.url}/${comment.avatar}`} alt="avatar" />
						<div className="content">
							<div>
								<span className="username">{comment.username}</span>
								<span className="comment-date">{localTime(comment.createdAt)}</span>
							</div>
							<div className="content">{comment.content}</div>
						</div>
					</div>
				))}
			</div>
			<CommentForm />
		</div>
	);
}
