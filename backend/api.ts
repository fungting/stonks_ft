import { CommentController } from "./controllers/comment.controller";
import { ScreenerController } from "./controllers/screener.controller";
import { StockController } from "./controllers/stock.controller";
import { UserController } from "./controllers/user.controller";
import { WatchlistController } from "./controllers/watchlist.controller";
import { isLoggedIn } from "./middlewares/guard";
import { CommentService } from "./services/comment.service";
import { ScreenerService } from "./services/screener.service";
import { StockService } from "./services/stock.service";
import { UserService } from "./services/user.service";
import { WatchlistService } from "./services/watchlist.service";
import { knex } from "./util/db";
import SocketIO from "socket.io";
import { Express } from "express";
import { CalendarService } from "./services/calendar.service";
import { CalendarController } from "./controllers/calendar.controller";

export function attachApi(app: Express, io: SocketIO.Server) {
	let userService = new UserService(knex);
	let userController = new UserController(userService);
	let stockService = new StockService(knex);
	let stockController = new StockController(stockService);
	let commentService = new CommentService(knex);
	let commentController = new CommentController(commentService, io);
	let screenerService = new ScreenerService(knex);
	let screenerController = new ScreenerController(screenerService);
	let watchlistService = new WatchlistService(knex);
	let watchlistController = new WatchlistController(watchlistService);
	let calendarService = new CalendarService(knex);
	let calendarController = new CalendarController(calendarService);

	app.use(userController.router);
	app.use(stockController.router);
	app.use(commentController.router);
	app.use(screenerController.router);
	app.use(calendarController.router);
	app.use(isLoggedIn, watchlistController.router);
}
