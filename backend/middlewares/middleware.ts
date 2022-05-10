import session from "express-session";
import grant from "grant";
import env from "../util/env";

export const sessionMiddleWare = session({
	secret: env.SECRET,
	resave: true,
	saveUninitialized: true,
});

export const oAuthMiddleWare = grant.express({
	defaults: {
		origin: env.NODE_ENV == "development" ? "http://localhost:8080" : "https://stonks.bond",
		transport: "session",
		state: true,
	},
	google: {
		key: env.GOOGLE_CLIENT_ID || "",
		secret: env.GOOGLE_CLIENT_SECRET || "",
		scope: ["profile", "email"],
		callback: "/user/login/google",
	},
});
