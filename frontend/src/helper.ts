export function localTime(time: string) {
	return new Date(time).toLocaleString();
}

export function commaNumber(num: number) {
	return num.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
}