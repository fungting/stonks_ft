import { toggleThemeAction } from "./action";
import { themeReducer } from "./reducer";
import { ThemeState } from "./state";

describe("Theme Reducer", () => {
	let initialState: ThemeState;
	beforeEach(() => {
		initialState = { theme: "light" };
	});

	test("1 + 1 = 2", () => {
		const newState = themeReducer(initialState, toggleThemeAction("dark"));
		expect(newState).toMatchObject({ theme: "dark" });
	});
});
