import { createLogger, format, transports } from "winston";
import env from "./env";

const logFormat = format.printf(function (info) {
	return `${info.timestamp}[${info.level}]: ${info.message}`;
});

export const logger = createLogger({
	level: env.WINSTON_LEVEL,
	transports: [
		new transports.Console({
			format: format.combine(format.colorize(), format.timestamp(), format.splat(), logFormat),
		}),
		// new winston.transports.File({
		// 	filename: "info.log",
		// 	level: "info",
		// 	format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), format.json()),
		// }),
	],
});
