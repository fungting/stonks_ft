export const toggleThemeAction = () => ({ type: "@@Theme/toggle" as const });

export type ThemeAction = ReturnType<typeof toggleThemeAction>;
