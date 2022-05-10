import { Knex } from "knex";
import { Request } from "express";
import { WatchlistController } from "../../controllers/watchlist.controller";
import { WatchlistService } from "../../services/watchlist.service";
import permit from "../../util/permit";
import jwtSimple from "jwt-simple";

jest.mock("../../services/watchlist.service");
jest.mock("../../util/permit");
jest.mock("jwt-simple");

describe("WatchlistController", () => {
	let controller: WatchlistController;
	let service: WatchlistService;
	let req: Request;

	beforeEach(function () {
		service = new WatchlistService({} as Knex);
		service.getWatchlist = jest.fn((userId) => Promise.resolve([]));
		service.createWatchlist = jest.fn((userId, name) => Promise.resolve(1));
		service.changeWatchlistName = jest.fn((watchlistId, name) => Promise.resolve({ message: "changed" }));
		service.deleteWatchlist = jest.fn((WatchlistId) => Promise.resolve({ message: "deleted" }));
		service.getAllWatchlistsName = jest.fn((userId) => Promise.resolve([{ id: 1, name: "a" }]));
		service.addStock = jest.fn((watchlistId, stockId) => Promise.resolve({ message: "stock added" }));
		service.deleteStock = jest.fn((watchlistId, stockId) => Promise.resolve({ message: "stock deleted" }));
		controller = new WatchlistController(service);
		req = { body: {}, session: { user: { id: 1 } }, params: {} } as any as Request;
		permit.check as jest.Mock;
		(jwtSimple.decode as jest.Mock).mockReturnValue({ id: 1 });
	});

	describe("GET /watchlist/all", () => {
		test("get all watchlists name", async () => {
			const result = await controller.getAllWatchlistsName(req);
			expect(service.getAllWatchlistsName).toBeCalled;
			expect(result).toMatchObject([{ id: 1, name: "a" }]);
		});
	});

	describe("GET /watchlist/:watchlistId", () => {
		test("get watchlist", async () => {
			req.params = { watchlistId: "1" };
			const result = await controller.get(req);
			expect(service.getWatchlist).toBeCalled;
			expect(result).toMatchObject({ stocks: [] });
		});

		test("throw error with string watchlistId", async () => {
			req.params = { watchlistId: "asjkfdsflsd" };
			await expect(controller.get(req)).rejects.toThrowError("Watchlist not exist");
		});

		test("throw error with watchlistId == 0", async () => {
			req.params = { watchlistId: "0" };
			await expect(controller.get(req)).rejects.toThrowError("Watchlist not exist");
		});

		test("throw error with watchlistId < 0", async () => {
			req.params = { watchlistId: "-1" };
			await expect(controller.get(req)).rejects.toThrowError("Watchlist not exist");
		});
	});

	describe("POST /watchlist", () => {
		test("create watchlist", async () => {
			req.body = { name: "a" };
			const result = await controller.post(req);
			expect(service.createWatchlist).toBeCalled();
			expect(result).toEqual(1);
		});

		test("throw error with empty name", async () => {
			req.body = { name: "        " };
			await expect(controller.post(req)).rejects.toThrowError("Watchlist name cannot be empty");
		});
	});

	describe("PUT /watchlist/:watchlistId", () => {
		test("change watchlist name", async () => {
			req.params = { watchlistId: "1" };
			req.body = { name: "a" };
			const result = await controller.put(req);
			expect(service.changeWatchlistName).toBeCalled;
			expect(result).toMatchObject({ message: "changed" });
		});

		test("throw error with wrong watchlistId", async () => {
			req.params = { watchlistId: "" };
			req.body = { name: "        " };
			await expect(controller.put(req)).rejects.toThrowError("Watchlist not exist");
		});

		test("throw error with empty watchlist name", async () => {
			req.params = { watchlistId: "1" };
			req.body = { name: "   " };
			await expect(controller.put(req)).rejects.toThrowError("Watchlist name cannot be empty");
		});
	});

	describe("DELETE /watchlist/:watchlistId", () => {
		test("get all watchlists name", async () => {
			req.params = { watchlistId: "1" };
			const result = await controller.delete(req);
			expect(service.deleteWatchlist).toBeCalled;
			expect(result).toMatchObject({ message: "deleted" });
		});

		test("throw error with wrong watchlistId", async () => {
			req.params = { watchlistId: "" };
			await expect(controller.delete(req)).rejects.toThrowError("Watchlist not exist");
		});
	});

	describe("POST /watchlist/:watchlistId/:stockId", () => {
		test("get all watchlists name", async () => {
			req.params = { watchlistId: "1", stockId: "1" };
			const result = await controller.addStock(req);
			expect(service.addStock).toBeCalled;
			expect(result).toMatchObject({ message: "stock added" });
		});

		test("throw error with wrong watchlistId", async () => {
			req.params = { watchlistId: "", stockId: "" };
			await expect(controller.addStock(req)).rejects.toThrowError("Watchlist not exist");
		});
	});

	describe("DELETE /watchlist/:watchlistId/:stockId", () => {
		test("get all watchlists name", async () => {
			req.params = { watchlistId: "1", stockId: "1" };

			const result = await controller.deleteStock(req);
			expect(service.deleteStock).toBeCalled;
			expect(result).toMatchObject({ message: "stock deleted" });
		});

		test("throw error with wrong watchlistId", async () => {
			req.params = { watchlistId: "", stockId: "" };
			await expect(controller.delete(req)).rejects.toThrow("Watchlist not exist");
		});
	});
});
