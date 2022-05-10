import express, { Request } from "express";
import { CommentService } from "../services/comment.service";
import { isLoggedIn } from "../middlewares/guard";
import { HttpError, UserComment } from "../util/models";
import SocketIO from "socket.io";
import { getUser, wrapControllerMethod } from "../util/helper";
export class CommentController {
	constructor(private commentService: CommentService, private io: SocketIO.Server) {
		this.router.get("/comment/:stockId", wrapControllerMethod(this.get));
		this.router.post("/comment/:stockId", isLoggedIn, wrapControllerMethod(this.post));
	}

	router = express.Router();

	get = async (req: Request) => {
		const stockId = Number(req.params.stockId);

		if (Number.isNaN(stockId) || stockId <= 0) throw new HttpError(400, "Stock not exist");
		return this.commentService.getComment(stockId);
	};

	post = async (req: Request) => {
		const user = getUser(req);
		if (user.id <= 0) throw new HttpError(400, "User not exist");

		const userId: number = Number(user.id);

		const stockId: number = Number(req.params.stockId);
		if (Number.isNaN(stockId) || stockId <= 0) throw new HttpError(400, "Stock not exist");

		const content: string = req.body.content;
		if (!content.replace(/\s+/g, "")) throw new HttpError(400, "Comment cannot be empty");
		if (content.length > 200) throw new HttpError(400, "Comment exceed maximum length");

		const insertComment: UserComment = { userId, stockId, content };
		const createdAt = await this.commentService.postComment(insertComment);

		const comment = { ...insertComment, username: user.username, avatar: user.avatar, createdAt };
		this.io.to(stockId.toString()).emit("comment", comment);
		return { comment };
	};
}
