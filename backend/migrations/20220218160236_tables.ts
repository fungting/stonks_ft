import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	if (!(await knex.schema.hasTable("users"))) {
		await knex.schema.createTable("users", (table) => {
			table.increments();
			table.string("username", 20);
			table.text("password");
			table.string("email");
			table.string("avatar").defaultTo("STONK.png");
			table.string("role", 10).defaultTo("user");
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("user_history"))) {
		await knex.schema.createTable("user_history", (table) => {
			table.increments();
			table.integer("user_id").unsigned().notNullable().references("users.id");
			table.decimal("deposit", 14, 2).defaultTo(10000);
			table.decimal("cash", 14, 2).defaultTo(10000);
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("user_social"))) {
		await knex.schema.createTable("user_social", (table) => {
			table.increments();
			table.integer("user_id").unsigned().notNullable().references("users.id");
			table.string("social_network", 20);
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("sectors"))) {
		await knex.schema.createTable("sectors", (table) => {
			table.increments();
			table.string("name", 100);
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("industries"))) {
		await knex.schema.createTable("industries", (table) => {
			table.increments();
			table.string("name", 100);
			table.integer("sector_id").unsigned().notNullable().references("sectors.id");
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("stocks"))) {
		await knex.schema.createTable("stocks", (table) => {
			table.increments();
			table.string("ticker", 20);
			table.string("name", 200);
			table.integer("industry_id").unsigned().references("industries.id");
			table.integer("sector_id").unsigned().references("sectors.id");
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE INDEX stock_idx on stocks(ticker); `);

	if (!(await knex.schema.hasTable("comments"))) {
		await knex.schema.createTable("comments", (table) => {
			table.increments();
			table.integer("user_id").unsigned().notNullable().references("users.id");
			table.integer("stock_id").unsigned().notNullable().references("stocks.id");
			table.text("content");
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("portfolios"))) {
		await knex.schema.createTable("portfolios", (table) => {
			table.increments();
			table.integer("user_id").unsigned().notNullable().references("users.id");
			table.integer("stock_id").unsigned().notNullable().references("stocks.id");
			table.decimal("position_size");
			table.decimal("unit_cost");
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("watchlists"))) {
		await knex.schema.createTable("watchlists", (table) => {
			table.increments();
			table.integer("user_id").unsigned().notNullable().references("users.id");
			table.string("name", 20);
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("watchlist_stock"))) {
		await knex.schema.createTable("watchlist_stock", (table) => {
			table.increments();
			table.integer("watchlist_id").unsigned().notNullable().references("watchlists.id");
			table.integer("stock_id").unsigned().notNullable().references("stocks.id");
			table.string("status").defaultTo("active");
			table.timestamps(false, true);
		});
	}
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("watchlist_stock");
	await knex.schema.dropTableIfExists("watchlists");
	await knex.schema.dropTableIfExists("portfolios");
	await knex.schema.dropTableIfExists("comments");
	await knex.schema.dropTableIfExists("stocks");
	await knex.schema.dropTableIfExists("industries");
	await knex.schema.dropTableIfExists("sectors");
	await knex.schema.dropTableIfExists("user_social");
	await knex.schema.dropTableIfExists("user_history");
	await knex.schema.dropTableIfExists("users");
}
