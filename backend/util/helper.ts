import camelcaseKeys from "camelcase-keys";
import { Request, Response } from "express";
import jwt from "../util/jwt";
import jwtSimple from "jwt-simple";
import permit from "../util/permit";
import { User } from "./models";

export function wrapControllerMethod(method: (req: Request) => any) {
	return async (req: Request, res: Response) => {
		try {
			const result = await method(req);
			res.json(result);
		} catch (error: any) {
			if ("status" in error) {
				res.status(error.status).json({ error: error.message });
			} else {
				res.status(500).json({ error: String(error) });
			}
		}
	};
}

export async function updateStock() {
	setInterval(() => {
		const openHour = 10;
		const closeHour = 16;
		const time = new Date().getHours() - 13;
		if (time >= openHour && time < closeHour) {
			console.log("index");
		} else {
			return;
		}
	}, 900000);
}

export function camelCaseKeys(obj: any) {
	return camelcaseKeys(obj);
}

export function makeMap(obj: {}, obj2: {}): {} {
	const ObjValArr: any[] = Object.values(obj2);
	obj[ObjValArr[0]] = ObjValArr[1];
	return obj;
}

export function getUser(req: Request) {
	const token = permit.check(req);
	const user: User = jwtSimple.decode(token, jwt.jwtSecret);
	return user;
}
