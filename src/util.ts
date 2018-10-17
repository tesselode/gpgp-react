export function deepCopyObject<T extends Object>(object: T): T {
	return JSON.parse(JSON.stringify(object));
}

export function shiftUp(array: Array<any>, position: number): void {
	if (position === 0) return;
	let above = array[position - 1];
	let current = array[position];
	array[position - 1] = current;
	array[position] = above;
}

export function shiftDown(array: Array<any>, position: number): void {
	if (position === array.length - 1) return;
	let below = array[position + 1];
	let current = array[position];
	array[position + 1] = current;
	array[position] = below;
}
