import { config } from "dotenv";

config();

const env = {
	AWS_HOST: process.env.AWS_HOST,
	DB_NAME: process.env.DB_NAME || "stonks2",
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD,
	POSTGRES_DB: process.env.POSTGRES_DB || "stonk-test",
	POSTGRES_USER: process.env.POSTGRES_USER,
	POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
	POSTGRES_HOST: process.env.POSTGRES_HOST || "localhost",
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	PORT: process.env.PORT || 8080,
	SECRET: process.env.SECRET || "stonks",
	NODE_ENV: process.env.NODE_ENV || "development",
	WINSTON_LEVEL: process.env.NODE_ENV == "development" ? "debug" : "info",
};

export default env;
