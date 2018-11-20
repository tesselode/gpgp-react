let uniqueId = 0;

export function getUniqueId(): number {
	uniqueId++;
	return uniqueId;
}
