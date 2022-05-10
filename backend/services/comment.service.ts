import { Knex } from "knex";
import { camelCaseKeys } from "../util/helper";
import { UserComment } from "../util/models";

export class CommentService {
	constructor(private knex: Knex) {}

	async getComment(stockId: number): Promise<UserComment[]> {
		return camelCaseKeys(
			await this.knex("comments as c")
				.select("u.username", "u.avatar", "c.content", "c.created_at")
				.join("users as u", "u.id", "c.user_id")
				.where("c.stock_id", stockId)
				.orderBy("created_at")
		);
	}

	async postComment(comment: UserComment): Promise<string> {
		return camelCaseKeys(
			await this.knex("comments")
				.insert({
					user_id: comment.userId,
					stock_id: comment.stockId,
					content: comment.content,
				})
				.returning("created_at")
		)[0];
	}
}
