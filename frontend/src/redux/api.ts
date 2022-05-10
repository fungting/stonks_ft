import { env } from "../env";

export async function callApi(url: string, method: string = "GET", body?: any) {
	try {
		const res = await fetch(env.url + url, {
			method,
			headers: {
				"Content-Type": body ? "application/json" : "text/plain",
				Authorization: `Bearer ${localStorage.getItem("token") || ''}`,
			},
			body: body ? JSON.stringify(body) : undefined,
		});
		return await res.json();
	} catch (error) {
		return { error: String(error) };
	}
}
