export interface HistoryStep<T> {
	data: T;
	description: string;
}

export default interface HistoryList<T> {
	steps: Array<HistoryStep<T>>;
	position: number;
}

export function addHistory<T>(
	historyList: HistoryList<T>,
	f: (T) => string,
	continuedAction = false,
): HistoryList<T> {
	let newHistory: HistoryList<T> = JSON.parse(JSON.stringify(historyList));
	newHistory.steps = newHistory.steps.slice(0, newHistory.position + 1);
	let newData: T = JSON.parse(JSON.stringify(newHistory.steps[newHistory.steps.length - 1].data));
	let description = f(newData);
	let newStep = {data: newData, description: description}
	if (continuedAction)
		newHistory.steps[newHistory.steps.length - 1] = newStep;
	else {
		newHistory.steps.push(newStep);
		newHistory.position++;
	}
	return newHistory;
}

export function changeHistoryPosition<T>(
	historyList: HistoryList<T>,
	position: number
): HistoryList<T> {
	let newHistory: HistoryList<T> = JSON.parse(JSON.stringify(historyList));
	newHistory.position = position;
	return newHistory;
}

export function getCurrentHistoryState<T>(historyList: HistoryList<T>): T {
	return historyList.steps[historyList.position].data;
}
