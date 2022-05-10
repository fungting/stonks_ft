import { Knex } from "knex";
import { CommentController } from "../../controllers/comment.controller";
import { CommentService } from "../../services/comment.service";
import { Server as SocketIO } from "socket.io";
import { Request } from "express";
import permit from "../../util/permit";
import jwtSimple from "jwt-simple";

jest.mock("../../services/comment.service");
jest.mock("../../util/permit");
jest.mock("jwt-simple");

describe("CommentController", () => {
	let controller: CommentController;
	let service: CommentService;
	let req: Request;
	let emit: jest.Mock;
	let io: SocketIO;

	beforeEach(function () {
		service = new CommentService({} as Knex);
		service.getComment = jest.fn((stockId) =>
			Promise.resolve([{ userId: 1, stockId: 1, content: "a", avatar: "p" }])
		);
		service.postComment = jest.fn((comment) => Promise.resolve("1"));
		emit = jest.fn((event, msg) => null);
		io = {
			to: jest.fn(() => ({ emit })),
		} as any as SocketIO;
		controller = new CommentController(service, io);
		req = { body: {}, session: {}, params: {} } as any as Request;
		permit.check as jest.Mock;
		(jwtSimple.decode as jest.Mock).mockReturnValue({ id: 1, username: "a", avatar: "p" });
	});

	describe("GET /Comment", () => {
		test("get comment", async () => {
			req.params = { stockId: "1" };
			const result = await controller.get(req);
			expect(result).toMatchObject([{ userId: 1, stockId: 1, content: "a", avatar: "p" }]);
		});

		test("throw error with string stockId", async () => {
			req.params = { stockId: "asdasfdsgf" };
			await expect(controller.get(req)).rejects.toThrow(Error);
			await expect(controller.get(req)).rejects.toThrowError("Stock not exist");
		});

		test("throw error with stockId = 0", async () => {
			req.params = { stockId: "0" };
			await expect(controller.get(req)).rejects.toThrow(Error);
			await expect(controller.get(req)).rejects.toThrowError("Stock not exist");
		});

		test("throw error with stockId < 0", async () => {
			req.params = { stockId: "-1" };
			await expect(controller.get(req)).rejects.toThrow(Error);
			await expect(controller.get(req)).rejects.toThrowError("Stock not exist");
		});
	});

	describe("POST /Comment", () => {
		beforeEach(function () {
			req.body = { content: "a" };
			req.params = { stockId: "1" };
		});

		test("post comment", async () => {
			const result = await controller.post(req);
			expect(io.to).toBeCalledWith("1");
			expect(io.to("1").emit).toBeCalledWith("comment", {
				avatar: "p",
				content: "a",
				createdAt: "1",
				stockId: 1,
				userId: 1,
				username: "a",
			});
			expect(result).toMatchObject({
				comment: {
					avatar: "p",
					content: "a",
					createdAt: "1",
					stockId: 1,
					userId: 1,
					username: "a",
				},
			});
		});

		test("throw error with string stockId", async () => {
			req.params = { stockId: "asdasfdsgf" };
			await expect(controller.post(req)).rejects.toThrow(Error);
			await expect(controller.post(req)).rejects.toThrowError("Stock not exist");
		});

		test("throw error with stockId = 0", async () => {
			req.params = { stockId: "0" };
			await expect(controller.post(req)).rejects.toThrow(Error);
			await expect(controller.post(req)).rejects.toThrowError("Stock not exist");
		});

		test("throw error with stockId < 0", async () => {
			req.params = { stockId: "-1" };
			await expect(controller.post(req)).rejects.toThrow(Error);
			await expect(controller.post(req)).rejects.toThrowError("Stock not exist");
		});

		test("throw error with no content", async () => {
			req.body = { content: "" };
			await expect(controller.post(req)).rejects.toThrow(Error);
			await expect(controller.post(req)).rejects.toThrowError("Comment cannot be empty");
		});

		test("throw error with content only space", async () => {
			req.body = { content: "     " };
			await expect(controller.post(req)).rejects.toThrow(Error);
			await expect(controller.post(req)).rejects.toThrowError("Comment cannot be empty");
		});

		test("throw error with content length  > 200", async () => {
			req.body = { content: Array(202).join("a") };
			await expect(controller.post(req)).rejects.toThrow(Error);
			await expect(controller.post(req)).rejects.toThrowError("Comment exceed maximum length");
		});
	});
});
