import { config } from "dotenv";
import env from "./util/env";

config();

const defaults = {
	client: "pg",
	connection: {
		host: env.POSTGRES_HOST,
		database: env.DB_NAME,
		user: env.DB_USER,
		password: env.DB_PASSWORD,
	},
	pool: {
		min: 2,
		max: 10,
	},
	migrations: {
		tableName: "knex_migrations",
	},
};

const knexConfigs = {
	development: {
		...defaults,
		// debug: true,
	},
	production: {
		client: "pg",
		connection: {
			host: process.env.AWS_HOST,
			database: process.env.POSTGRES_DB,
			user: process.env.POSTGRES_USER,
			password: process.env.AWS_PASSWORD,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: "knex_migrations",
		},
	},
	test: {
		client: "pg",
		connection: {
			host: process.env.POSTGRES_HOST,
			database: process.env.TESTDB_NAME,
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: "knex_migrations",
		},
	},
};

export default knexConfigs;
