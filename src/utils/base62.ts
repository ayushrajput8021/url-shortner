const BASE_CHARACTERS =
	'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Converts a number to a base62 string.
 * @param num - number to be converted to base62
 * @returns base62 encoded string
 */
export function toBase62(num: number): string {
	if (num === 0) return '0';
	let result = '';
	do {
		result = BASE_CHARACTERS[num % 62] + result;
		num = Math.floor(num / 62);
	} while (num > 0);
	return result;
}

/**
 * Converts a base62 string back to a number.
 * @param str - base62 encoded string
 * @returns decoded number
 */
export function fromBase62(str: string): number {
	let result = 0;
	for (let i = 0; i < str.length; i++) {
		result = result * 62 + BASE_CHARACTERS.indexOf(str[i]);
	}
	return result;
}
