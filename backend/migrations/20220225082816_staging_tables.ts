import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	if (!(await knex.schema.hasTable("staging_stock_prices"))) {
		await knex.schema.createTable("staging_stock_prices", (table) => {
			table.increments();
			table.string("ticker", 20);
			table.decimal("price", 12, 4);
			table.integer("year");
			table.integer("month");
			table.integer("day");
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("staging_stock_earnings"))) {
		await knex.schema.createTable("staging_stock_earnings", (table) => {
			table.increments();
			table.string("ticker", 20);
			table.integer("earning_year");
			table.integer("earning_quarter");
			table.string("release_time", 20);
			table.decimal("eps_estimated", 10, 4);
			table.decimal("eps_reported", 10, 4);
			table.decimal("revenue_estimated", 14, 2);
			table.decimal("revenue_reported", 14, 2);
			table.integer("year");
			table.integer("month");
			table.integer("day");
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("staging_economic_indicators"))) {
		await knex.schema.createTable("staging_economic_indicators", (table) => {
			table.increments();
			table.string("indicator", 30);
			table.string("country", 20);
			table.decimal("stat", 12, 2);
			table.integer("year");
			table.integer("month");
			table.integer("day");
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("staging_sentiment_indicators"))) {
		await knex.schema.createTable("staging_sentiment_indicators", (table) => {
			table.increments();
			table.string("sentiment", 20);
			table.decimal("stat", 10, 2);
			table.integer("year");
			table.integer("month");
			table.integer("day");
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("staging_treasury_rates"))) {
		await knex.schema.createTable("staging_treasury_rates", (table) => {
			table.increments();
			table.string("name", 20);
			table.decimal("rate", 10, 2);
			table.integer("year");
			table.integer("month");
			table.integer("day");
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(
		`CREATE OR REPLACE FUNCTION insert_stock_earnings() RETURNS trigger AS $$
			BEGIN
		
				INSERT INTO stock_earnings (date_id, stock_id, year_quarter_id, release_time, eps_estimated, eps_reported, revenue_estimated, revenue_reported, created_at)
				(select dd.id, s.id, dyq.id, NEW.release_time, NEW.eps_estimated, NEW.eps_reported, NEW.revenue_estimated, NEW.revenue_reported, NEW.created_at
				from dim_dates as dd, dim_year_quarters as dyq, stocks as s
				where dd."year" = NEW.year and dd."month" = NEW.month and dd."day" = NEW.day 
				and dyq."year" = NEW.earning_year and dyq.quarter = NEW.earning_quarter 
				and s.ticker = NEW.ticker) 
				on conflict (stock_id, year_quarter_id)
				DO UPDATE set date_id = EXCLUDED.date_id, eps_reported = NEW.eps_reported, revenue_reported = NEW.revenue_reported, created_at = NEW.created_at, updated_at = NOW();
		
				return NEW;
			END
		$$ LANGUAGE plpgsql;
		
		CREATE TRIGGER stock_earnings_trigger AFTER INSERT ON staging_stock_earnings FOR EACH ROW EXECUTE PROCEDURE insert_stock_earnings();
		`
	);

	await knex.schema.raw(
		`CREATE OR REPLACE FUNCTION insert_treasury_rates() RETURNS trigger AS $$
			BEGIN
		
				INSERT INTO treasury_rates (date_id, maturity_period_id, rate, created_at)
				(select dd.id, dmp.id, NEW.rate, NEW.created_at
				from dim_dates as dd, dim_maturity_periods as dmp
				where dd."year" = NEW.year and dd."month" = NEW.month and dd."day" = NEW.day 
				and dmp."name" = NEW.name) 
				on conflict (date_id, maturity_period_id)
				DO UPDATE set updated_at = NOW();
		
				return NEW;
			END
		$$ LANGUAGE plpgsql;
		
		CREATE TRIGGER treasury_rates_trigger AFTER INSERT ON staging_treasury_rates FOR EACH ROW EXECUTE PROCEDURE insert_treasury_rates();
		`
	);

	await knex.schema.raw(
		`CREATE OR REPLACE FUNCTION insert_sentiments() RETURNS trigger AS $$
			BEGIN
		
				INSERT INTO sentiment_indicators (date_id, sentiment_id, stat, created_at)
				(select dd.id, ds.id, NEW.stat, NEW.created_at
				from dim_dates as dd, dim_sentiments as ds
				where dd."year" = NEW.year and dd."month" = NEW.month and dd."day" = NEW.day
				and ds.sentiment = NEW.sentiment) 
				on conflict (date_id, sentiment_id)
				DO UPDATE set updated_at = NOW();
		
				return NEW;
			END
		$$ LANGUAGE plpgsql;
		
		CREATE TRIGGER sentiments_trigger AFTER INSERT ON staging_sentiment_indicators FOR EACH ROW EXECUTE PROCEDURE insert_sentiments();
		`
	);

	// await knex.schema.raw(
	// 	`CREATE OR REPLACE FUNCTION insert_stock_prices() RETURNS trigger AS $$
	// 		DECLARE
	// 			new_date_id integer;
	// 		BEGIN
	// 			INSERT INTO dim_dates (year,month,day) VALUES (NEW.year,NEW.month,NEW.day) on conflict(year,month,day) 
	// 				DO UPDATE set updated_at = NOW() RETURNING id into new_date_id;

	// 			INSERT INTO stock_prices (stock_id,date_id,price) VALUES (NEW.stock_id, new_date_id, NEW.price) on conflict(stock_id, date_id) 
	// 				DO UPDATE set price = NEW.price, updated_at = NOW();
		
	// 			return NEW;
	// 		END
	// 	$$ LANGUAGE plpgsql;
		
	// 	CREATE TRIGGER stock_prices_trigger AFTER INSERT ON staging_stock_prices FOR EACH ROW EXECUTE PROCEDURE insert_stock_prices();
	// 	`
	// );
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.raw(`DROP TRIGGER IF EXISTS sentiments_trigger ON staging_sentiment_indicators;`);
	await knex.schema.raw(`DROP TRIGGER IF EXISTS treasury_rates_trigger ON staging_treasury_rates;`);
	await knex.schema.raw(`DROP TRIGGER IF EXISTS stock_earnings_trigger ON staging_stock_earnings;`);
	await knex.schema.dropTableIfExists("staging_treasury_rates");
	await knex.schema.dropTableIfExists("staging_sentiment_indicators");
	await knex.schema.dropTableIfExists("staging_economic_indicators");
	await knex.schema.dropTableIfExists("staging_stock_earnings");
	await knex.schema.dropTableIfExists("staging_stock_prices");
}
