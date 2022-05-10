import socketIO from "socket.io";
import { logger } from "./logger";

export let io: socketIO.Server;

export function setSocketIO(value: socketIO.Server) {
	io = value;
	io.on("connection", function (socket) {
		logger.info(`socket id ${socket.id} is online.`);

		socket.on("join-room", (stockId) => {
			socket.join(stockId.toString());
			logger.info(`socket id ${socket.id} has joined room ${stockId}`);
		});
	});
}
