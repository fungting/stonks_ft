import express, { Request } from "express";
import { CalendarService } from "../services/calendar.service";
import { wrapControllerMethod } from "../util/helper";

export class CalendarController {
	constructor(private calendarService: CalendarService) {
		this.router.get("/calendar/earnings/all", wrapControllerMethod(this.getAllEarnings));
		this.router.get("/calendar/earnings/now", wrapControllerMethod(this.getTodayEarnings));
		this.router.get("/calendar/earnings/past", wrapControllerMethod(this.getPastTenDaysEarnings));
		this.router.get("/calendar/earnings/next", wrapControllerMethod(this.getNextTenDaysEarnings));
	}

	router = express.Router();
	getAllEarnings = async (req: Request) => {
		const earnings = await this.calendarService.getAllEarnings();
		return { earnings };
	};

	getTodayEarnings = async (req: Request) => {
		const earnings = await this.calendarService.getTodayEarnings();
		return { earnings };
	};

	getPastTenDaysEarnings = async (req: Request) => {
		const earnings = await this.calendarService.getPastTenDaysEarnings();
		return { earnings };
	};

	getNextTenDaysEarnings = async (req: Request) => {
		const earnings = await this.calendarService.getNextTenDaysEarnings();
		return { earnings };
	};
}
