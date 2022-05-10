import Knex from "knex";
import knexConfigs from "../../knexfile";
import { UserService } from "../../services/user.service";

const knex = Knex(knexConfigs["test"]);

describe("UserService", () => {
	let userService: UserService;

	beforeEach(async () => {
		userService = new UserService(knex);
		await knex("users").del();
		await knex("users").insert([{ username: "a", password: "1", email: "1@1.com", avatar: "p", role: "user" }]);
	});

	afterAll(async () => {
		await knex("users").del();
		await knex.destroy();
	});

	test("get user by username", async () => {
		const user = await userService.getUserByUsername("a");

		expect(user).toMatchObject({
			username: "a",
			password: "1",
			email: "1@1.com",
			avatar: "p",
			role: "user",
		});
	});

	test("get user by email", async () => {
		const user = await userService.getUserByEmail("1@1.com");

		expect(user).toMatchObject({
			username: "a",
			password: "1",
			email: "1@1.com",
			avatar: "p",
			role: "user",
		});
	});

	// test("register", async () => {
	// 	const user = await userService.addUser("b", "2", "2@2.com");

	// 	expect(user).toMatchObject({
	// 		username: "b",
	// 		email: "2@2.com",
	// 		avatar: "STONK.png",
	// 		role: "user",
	// 	});
	// });
});
