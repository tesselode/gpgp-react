export interface Rect {
	l: number;
	t: number;
	r: number;
	b: number;
}

export function deepCopyObject<T>(object: T): T {
	return JSON.parse(JSON.stringify(object));
}

export function shiftUp(array: any[], position: number): void {
	if (position === 0) return;
	const above = array[position - 1];
	const current = array[position];
	array[position - 1] = current;
	array[position] = above;
}

export function shiftDown(array: any[], position: number): void {
	if (position === array.length - 1) return;
	const below = array[position + 1];
	const current = array[position];
	array[position + 1] = current;
	array[position] = below;
}

let uniqueId = 0;

export function getUniqueId(): number {
	uniqueId++;
	return uniqueId;
}
