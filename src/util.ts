export function deepCopyObject<T>(object: T): T {
	return JSON.parse(JSON.stringify(object));
}

let uniqueId = 0;

export function getUniqueId(): number {
	uniqueId++;
	return uniqueId;
}
