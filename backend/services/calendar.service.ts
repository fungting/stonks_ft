import { Knex } from "knex";
import { camelCaseKeys } from "../util/helper";

export class CalendarService {
	constructor(private knex: Knex) {}

	async getAllEarnings() {
		const earnings = await this.knex.raw(/*sql*/ `select sse.created_at, s.ticker, sse.release_time 
		from stock_earnings sse 
		join stocks s on s.id = sse.stock_id 
		join dim_year_quarters dyq on dyq.id = sse.year_quarter_id
		order by sse.date_id;`);

		return camelCaseKeys(earnings.rows);
	}
	async getTodayEarnings(): Promise<[]> {
		const earnings = await this.knex
			.raw(/*sql*/ `select sse.created_at, s.ticker, s."name", dyq.year, dyq.quarter, sse.eps_estimated, sse.eps_reported, sse.revenue_estimated, sse.revenue_reported  
        from stock_earnings sse 
        join stocks s on s.id = sse.stock_id 
        join dim_year_quarters dyq on dyq.id = sse.year_quarter_id
        where sse.created_at in (select created_at from stock_earnings where created_at >= (now() - interval '1 DAY') and created_at <= now())
        order by date_id`);

		return camelCaseKeys(earnings.rows);
	}

	async getPastTenDaysEarnings(): Promise<[]> {
		const earnings = await this.knex
			.raw(/*sql*/ `select sse.created_at, s.ticker, s."name", dyq.year, dyq.quarter, sse.release_time, sse.eps_estimated, sse.eps_reported, sse.revenue_estimated, sse.revenue_reported  
			from stock_earnings sse 
			join stocks s on s.id = sse.stock_id 
			join dim_year_quarters dyq on dyq.id = sse.year_quarter_id
			where sse.created_at in (select created_at from stock_earnings where created_at >= (now() - interval '10 DAY') and created_at < (now() - interval '1 DAY'))
			order by date_id desc;`);

		return camelCaseKeys(earnings.rows);
	}

	async getNextTenDaysEarnings(): Promise<[]> {
		const earnings = await this.knex
			.raw(/*sql*/ `select sse.created_at, s.ticker, s."name", dyq.year, dyq.quarter, sse.eps_estimated, sse.eps_reported, sse.revenue_estimated, sse.revenue_reported  
            from stock_earnings sse 
            join stocks s on s.id = sse.stock_id 
            join dim_year_quarters dyq on dyq.id = sse.year_quarter_id
            where sse.created_at in (select created_at from stock_earnings where created_at <= (now() + interval '10 DAY') and created_at > now())
            order by date_id;`);

		return camelCaseKeys(earnings.rows);
	}
}
