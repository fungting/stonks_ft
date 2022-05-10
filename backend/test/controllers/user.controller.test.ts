import { Request, Response } from "express";
import { Knex } from "knex";
import { UserService } from "../../services/user.service";
import { checkPassword } from "../../util/hash";
import { User } from "../../util/models";
import { UserController } from "../../controllers/user.controller";
import jwtSimple from "jwt-simple";

jest.mock("../../services/user.service");
jest.mock("../../util/hash");
jest.mock("jwt-simple");

describe("UserController", () => {
	let controller: UserController;
	let service: UserService;
	let req: Request;
	let res: Response;

	// let resStatusSpy: jest.SpyInstance;
	// let resJsonSpy: jest.SpyInstance;
	// let resRedirectSpy: jest.SpyInstance;

	beforeEach(function () {
		let user: User = {
			id: 1,
			username: "1",
			password: "123",
			email: "",
			avatar: "",
			role: "user",
		};
		service = new UserService({} as Knex);
		service.getUserByUsername = jest.fn((username) => Promise.resolve(user));
		service.getUserByEmail = jest.fn((email) => Promise.resolve(user));
		// service.addUser = jest.fn((username, password, email) => Promise.resolve());
		jest.spyOn(service, "getGoogleInfo").mockImplementation(async (accessToken) => user);

		controller = new UserController(service);
		req = {
			body: {},
			session: {},
			grant: { response: { accessToken: 1 } },
		} as any as Request;
		res = {
			status: jest.fn(() => res),
			json: jest.fn(),
			redirect: jest.fn(),
		} as any as Response;
		(jwtSimple.encode as jest.Mock).mockReturnValue("1");
		// resStatusSpy = jest.spyOn(res, "status");
		// resJsonSpy = jest.spyOn(res, "json");
		// resRedirectSpy = jest.spyOn(res, "redirect");
	});

	describe("POST /user/login", () => {
		test("login with username", async () => {
			(checkPassword as jest.Mock).mockReturnValue(true);
			req.body = { username: "1", password: "123" };
			const result = await controller.login(req);
			expect(checkPassword).toBeCalledWith("123", "123");
			expect(service.getUserByUsername).toBeCalled();
			expect(result).toMatchObject({ token: "1" });
		});

		test("login with email", async () => {
			(checkPassword as jest.Mock).mockReturnValue(true);
			req.body = { username: "1@1.com", password: "123" };
			const result = await controller.login(req);
			expect(service.getUserByEmail).toBeCalled();
			expect(checkPassword).toBeCalledWith("123", "123");
			expect(result).toMatchObject({ token: "1" });
		});

		test("throw error with invalid username", async () => {
			await expect(controller.login(req)).rejects.toThrowError("Invalid username or password.");
		});

		test("throw error with invalid password", async () => {
			(checkPassword as jest.Mock).mockReturnValue(false);
			await expect(controller.login(req)).rejects.toThrowError("Invalid username or password.");
		});
	});

	describe("POST /user", () => {
		test.todo("register");
	});

	describe("PUT /user", () => {
		test.todo("updateUser");
	});

	describe("POST /user/validate", () => {
		test.todo("validateInput");
	});
});
