import { Knex } from "knex";
import fetch from "cross-fetch";
import { camelCaseKeys } from "../util/helper";
import { Portfolio, User } from "../util/models";

export class UserService {
	constructor(private knex: Knex) {}

	async getUserByUsername(username: string): Promise<User> {
		return (
			await this.knex("users")
				.select("id", "username", "email", "password", "avatar", "role")
				.where("username", username)
		)[0];
	}

	async getUserByEmail(email: string): Promise<User> {
		return (
			await this.knex("users")
				.select("id", "username", "email", "password", "avatar", "role")
				.where("email", email)
		)[0];
	}

	async addUser(username: string, password: string, email: string): Promise<Omit<User, "password">> {
		const user = (
			await this.knex("users")
				.insert({ username, password, email })
				.returning(["id", "username", "email", "avatar", "role"])
		)[0];
		await this.knex("user_history").insert({ user_id: user.id });
		return user;
	}

	async getGoogleInfo(accessToken: string) {
		const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
			method: "get",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const result = await res.json();
		return result;
	}

	async getUserPortfolio(userId: number): Promise<Portfolio[]> {
		const portfolioQuery = await this.queryPortfolio(userId);
		if (portfolioQuery.length > 0) {
			const portfolio = this.calcPortfolio(portfolioQuery);
			return portfolio.filter((stock) => stock.shares !== 0);
		}
		return [];
	}

	// get portfolio
	private async queryPortfolio(userId: number): Promise<Portfolio[]> {
		return camelCaseKeys(
			(
				await this.knex.raw(
					/*sql*/
					`select s.ticker, s.name ,p.position_size shares, p.unit_cost, se.name as sector_name
					from portfolios p
					join stocks s on p.stock_id = s.id
					join users u on p.user_id = u.id 
					join sectors se on s.sector_id = se.id
					where u.id = ?
					order by s.ticker asc;`,
					[userId]
				)
			).rows
		);
	}

	private calcPortfolio(rows: Portfolio[]): Portfolio[] {
		const arr: any = [];
		for (let row of rows) {
			const { ticker, name, shares, unitCost, sectorName } = row;
			let stock = arr.at(-1);
			if (stock && stock.ticker === ticker) {
				stock.shares += Number(row.shares);
				stock.totalCost += Number(row.unitCost) * Number(shares);
			} else {
				arr.push({
					ticker,
					name,
					sectorName,
					shares: Number(shares),
					totalCost: Number(unitCost) * Number(shares),
				});
			}
		}
		return arr;
	}

	async updateSetting(username: any, hashedPassword: any, filename: any, userId: number) {
		return camelCaseKeys(
			await this.knex.raw(
				/*sql*/
				`update users set username = COALESCE(?, username),
				password = COALESCE(?, password),
				avatar = COALESCE(?, avatar)
				where id = ?;`,
				[username, hashedPassword, filename, userId]
			)
		);
	}

	async getBalance(userId: number): Promise<{ deposit: string; cash: string }> {
		const balance = await this.knex<{ deposit: string; cash: string }>("user_history")
			.select("deposit", "cash")
			.where("user_id", userId)
			.orderBy("created_at", "desc")
			.limit(1);
		return balance[0];
	}

	async transfer(cash: number, deposit: number, userId: number): Promise<void> {
		await this.knex("user_history").insert({ deposit, cash, user_id: userId });
		return;
	}
}
