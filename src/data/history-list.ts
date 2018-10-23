import { deepCopyObject } from "../util";

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
	f: (data: T) => string | boolean,
	continuedAction = false,
): HistoryList<T> {
	let newHistory = deepCopyObject(historyList);
	newHistory.steps = newHistory.steps.slice(0, newHistory.position + 1);
	let newData = deepCopyObject(newHistory.steps[newHistory.steps.length - 1].data);
	let description = f(newData);
	if (typeof description === 'boolean') return historyList;
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
	let newHistory = deepCopyObject(historyList);
	newHistory.position = position;
	return newHistory;
}

export function getCurrentHistoryState<T>(historyList: HistoryList<T>): T {
	return historyList.steps[historyList.position].data;
}
