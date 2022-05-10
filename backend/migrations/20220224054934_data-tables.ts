import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {

	if (!(await knex.schema.hasTable("dim_dates"))) {
		await knex.schema.createTable("dim_dates", (table) => {
			table.increments();
			table.integer("year");
			table.integer("month");
			table.integer("day");
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE UNIQUE INDEX dates_unique_idx on dim_dates(year,month,day); `);

	if (!(await knex.schema.hasTable("dim_year_quarters"))) {
		await knex.schema.createTable("dim_year_quarters", (table) => {
			table.increments();
			table.integer("year");
			table.integer("quarter");
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE UNIQUE INDEX year_quarters_unique_idx on dim_year_quarters(year,quarter); `);

	if (!(await knex.schema.hasTable("dim_indicators"))) {
		await knex.schema.createTable("dim_indicators", (table) => {
			table.increments();
			table.string("indicator", 30);
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE UNIQUE INDEX indicators_unique_idx on dim_indicators(indicator); `);

	if (!(await knex.schema.hasTable("dim_countries"))) {
		await knex.schema.createTable("dim_countries", (table) => {
			table.increments();
			table.string("country", 20);
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE UNIQUE INDEX countries_unique_idx on dim_countries(country); `);

	if (!(await knex.schema.hasTable("dim_sentiments"))) {
		await knex.schema.createTable("dim_sentiments", (table) => {
			table.increments();
			table.string("sentiment", 20);
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE UNIQUE INDEX sentiments_unique_idx on dim_sentiments(sentiment); `);

	if (!(await knex.schema.hasTable("dim_maturity_periods"))) {
		await knex.schema.createTable("dim_maturity_periods", (table) => {
			table.increments();
			table.string("name", 20);
			table.float("period");
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE UNIQUE INDEX maturity_periods_idx on dim_maturity_periods(name,period); `);

	if (!(await knex.schema.hasTable("stock_prices"))) {
		await knex.schema.createTable("stock_prices", (table) => {
			table.increments();
			table.integer("stock_id").unsigned().notNullable().references("stocks.id");
			table.integer("date_id").unsigned().notNullable().references("dim_dates.id");
			table.decimal("price", 12, 4);
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE UNIQUE INDEX stock_prices_idx on stock_prices(stock_id, date_id); `);

	if (!(await knex.schema.hasTable("industry_rs"))) {
		await knex.schema.createTable("industry_rs", (table) => {
			table.increments();
			table.integer("industry_id").unsigned().notNullable().references("industries.id");
			table.integer("date_id").unsigned().notNullable().references("dim_dates.id");
			table.integer("rs_rating").unsigned();
			table.integer("ranking").unsigned();
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE UNIQUE INDEX industry_rs_idx on industry_rs(industry_id, date_id); `);

	if (!(await knex.schema.hasTable("stock_rs"))) {
		await knex.schema.createTable("stock_rs", (table) => {
			table.increments();
			table.integer("date_id").unsigned().notNullable().references("dim_dates.id");
			table.integer("stock_id").unsigned().notNullable().references("stocks.id");
			table.integer("rs_rating").unsigned();
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE UNIQUE INDEX stock_rs_idx on stock_rs(stock_id, date_id); `);

	if (!(await knex.schema.hasTable("stock_market_caps"))) {
		await knex.schema.createTable("stock_market_caps", (table) => {
			table.increments();
			table.integer("stock_id").unsigned().notNullable().references("stocks.id");
			table.decimal("market_cap", 14, 2);
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("stock_earnings"))) {
		await knex.schema.createTable("stock_earnings", (table) => {
			table.increments();
			table.integer("date_id").unsigned().notNullable().references("dim_dates.id");
			table.integer("stock_id").unsigned().notNullable().references("stocks.id");
			table.integer("year_quarter_id").unsigned().notNullable().references("dim_year_quarters.id");
			table.string("release_time", 20);
			table.decimal("eps_estimated", 10, 4);
			table.decimal("eps_reported", 10, 4);
			table.decimal("revenue_estimated", 14, 2);
			table.decimal("revenue_reported", 14, 2);
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE UNIQUE INDEX stock_earnings_idx on stock_earnings(stock_id, year_quarter_id); `);

	if (!(await knex.schema.hasTable("economic_indicators"))) {
		await knex.schema.createTable("economic_indicators", (table) => {
			table.increments();
			table.integer("indicator_id").unsigned().notNullable().references("dim_indicators.id");
			table.integer("country_id").unsigned().notNullable().references("dim_countries.id");
			table.integer("date_id").unsigned().notNullable().references("dim_dates.id");
			table.decimal("stat", 12, 2);
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE UNIQUE INDEX economic_indicators_idx on economic_indicators(indicator_id, country_id, date_id); `);

	if (!(await knex.schema.hasTable("sentiment_indicators"))) {
		await knex.schema.createTable("sentiment_indicators", (table) => {
			table.increments();
			table.integer("sentiment_id").unsigned().notNullable().references("dim_sentiments.id");
			table.integer("date_id").unsigned().notNullable().references("dim_dates.id");
			table.decimal("stat", 10, 2);
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE UNIQUE INDEX sentiment_indicators_idx on sentiment_indicators(sentiment_id, date_id); `);

	if (!(await knex.schema.hasTable("treasury_rates"))) {
		await knex.schema.createTable("treasury_rates", (table) => {
			table.increments();
			table.integer("date_id").unsigned().notNullable().references("dim_dates.id");
			table.integer("maturity_period_id").unsigned().notNullable().references("dim_maturity_periods.id");
			table.decimal("rate", 10, 2);
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE UNIQUE INDEX treasury_rates_idx on treasury_rates(maturity_period_id, date_id); `);
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("treasury_rates");
	await knex.schema.dropTableIfExists("sentiment_indicators");
	await knex.schema.dropTableIfExists("economic_indicators");
	await knex.schema.dropTableIfExists("stock_earnings");
	await knex.schema.dropTableIfExists("stock_market_caps");
	await knex.schema.dropTableIfExists("stock_rs");
	await knex.schema.dropTableIfExists("industry_rs");
	await knex.schema.dropTableIfExists("stock_prices");
	await knex.schema.dropTableIfExists("dim_maturity_periods");
	await knex.schema.dropTableIfExists("dim_indicators");
	await knex.schema.dropTableIfExists("dim_countries");
	await knex.schema.dropTableIfExists("dim_sentiments");
	await knex.schema.dropTableIfExists("dim_year_quarters");
	await knex.schema.dropTableIfExists("dim_dates");
}
