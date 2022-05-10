import express, { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { checkPassword, hashPassword } from "../util/hash";
import { HttpError, User } from "../util/models";
import { multerSingle } from "../util/multer";
import { isLoggedIn } from "../middlewares/guard";
import crypto from "crypto";
import { logger } from "../util/logger";
import { getUser, wrapControllerMethod } from "../util/helper";
import jwt from "../util/jwt";
import jwtSimple from "jwt-simple";
import fetch from "cross-fetch";

export class UserController {
	constructor(private userService: UserService) {
		this.router.post("/user", wrapControllerMethod(this.register));
		this.router.put("/user", isLoggedIn, multerSingle, wrapControllerMethod(this.updateUser));
		this.router.post("/user/login", wrapControllerMethod(this.login));
		this.router.post("/user/register", wrapControllerMethod(this.register));
		this.router.get("/user/login/google", this.loginGoogle);
		this.router.post("/user/login/facebook", wrapControllerMethod(this.loginFacebook));
		this.router.get("/user/portfolio", isLoggedIn, wrapControllerMethod(this.getPortfolio));
		this.router.get("/user/balance", isLoggedIn, wrapControllerMethod(this.getBalance));
		this.router.post("/user/deposit", isLoggedIn, wrapControllerMethod(this.deposit));
		this.router.post("/user/withdrawal", isLoggedIn, wrapControllerMethod(this.withdraw));
	}

	router = express.Router();

	login = async (req: Request) => {
		if (!req.body.username || !req.body.password) {
			throw new HttpError(401, "Invalid username or password.");
		}
		const { username, password } = req.body;
		let foundUser: User;

		/@/.test(username)
			? (foundUser = await this.userService.getUserByEmail(username))
			: (foundUser = await this.userService.getUserByUsername(username));

		if (!foundUser || !(await checkPassword(password, foundUser.password))) {
			throw new HttpError(400, "Invalid username or password.");
		}

		const { password: foundPassword, ...user } = foundUser;
		logger.info("%o", user);
		const payload = { ...user };
		const token = jwtSimple.encode(payload, jwt.jwtSecret);
		return { token };
	};

	register = async (req: Request) => {
		const error = await this.validateInput(req);
		if (error) throw error;
		const { username, email, password } = req.body;
		const hashedPassword = await hashPassword(password.toString());

		const user: Omit<User, "password"> = await this.userService.addUser(username, hashedPassword, email);
		const token = jwtSimple.encode(user, jwt.jwtSecret);

		return { token };
	};

	private async validateInput(req: Request) {
		const { username, email, password, confirmPassword } = req.body;

		const space = /\s+/g;
		if (username.replace(space, "") === "") return new HttpError(400, "Username cannot be empty.");
		if (email.replace(space, "") === "") return new HttpError(400, "Email cannot be empty.");
		if (password.replace(space, "") === "") return new HttpError(400, "Password cannot be empty.");
		if (username.match(/@/)) return new HttpError(400, "Cannot use @ in username.");
		if (password !== confirmPassword) return new HttpError(400, "The passwords you entered do not match.");

		let user = await this.userService.getUserByUsername(username);
		if (user) return new HttpError(400, "Username has been used.");
		let userEmail = await this.userService.getUserByEmail(email);
		if (userEmail) return new HttpError(400, "This email address is not available. Choose a different address.");
		return;
	}

	updateUser = async (req: Request) => {
		let { username, password, confirmPassword } = req.body;
		const userId = req.session["user"].id;
		let filename = req.file ? req.file.filename : null;

		if (password != confirmPassword) throw new HttpError(400, "Invalid password.");
		let hashedPassword = password ? await hashPassword(password) : null;
		!username && (username = null);

		await this.userService.updateSetting(username, hashedPassword, filename, userId);
		return;
	};

	loginGoogle = async (req: Request, res: Response) => {
		const accessToken = req.session?.["grant"].response.access_token;
		const googleUserInfo = await this.userService.getGoogleInfo(accessToken);
		let foundUser: User = await this.userService.getUserByEmail(googleUserInfo.email);
		if (!foundUser) {
			await this.userService.addUser(
				googleUserInfo.name.concat(Date.now()),
				await hashPassword(crypto.randomBytes(20).toString("hex")),
				googleUserInfo.email
			);
		}
		// req.session["user"] = foundUser;
		// res.redirect("/portfolio.html");
	};

	loginFacebook = async (req: Request) => {
		try {
			if (!req.body.accessToken) throw new HttpError(401, "Wrong Access Token.");

			const { accessToken } = req.body;
			const fetchResponse = await fetch(
				`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`
			);
			const result = await fetchResponse.json();
			if (result.error) throw new HttpError(401, "Wrong Access Token.");
			const user = await this.userService.getUserByEmail(result.email);

			if (!user) throw new HttpError(401, "You are not registered.");
			const payload = { ...user };
			const token = jwtSimple.encode(payload, jwt.jwtSecret);
			return { token };
		} catch (e: any) {
			throw e;
		}
	};

	getPortfolio = async (req: Request) => {
		const user = getUser(req);
		if (user.id <= 0) throw new HttpError(400, "User not exist");

		const portfolio = await this.userService.getUserPortfolio(user.id);
		return { portfolio };
	};

	getBalance = async (req: Request) => {
		const user = getUser(req);
		if (user.id <= 0) throw new HttpError(400, "User not exist");

		const { deposit, cash } = await this.userService.getBalance(user.id);
		return { deposit, cash };
	};

	deposit = async (req: Request) => {
		const user = getUser(req);
		if (user.id <= 0) throw new HttpError(400, "User not exist");

		const addCash = Number(req.body.cash);
		const { deposit, cash } = await this.userService.getBalance(user.id);
		const depositCash = Number(cash) + addCash;
		await this.userService.transfer(depositCash, Number(deposit) + addCash, user.id);
		return { cash: depositCash };
	};

	withdraw = async (req: Request) => {
		const user = getUser(req);
		if (user.id <= 0) throw new HttpError(400, "User not exist");

		const minusCash = Number(req.body.cash);
		const { deposit, cash } = await this.userService.getBalance(user.id);
		const remainingCash = Number(cash) - minusCash;

		if (remainingCash < 0) throw new HttpError(400, "Not enough cash");
		await this.userService.transfer(remainingCash, Number(deposit) - minusCash, user.id);
		return { cash: remainingCash };
	};
}
