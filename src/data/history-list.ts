import { deepCopyObject } from "../util";

/** A single history state for a piece of data. */
export interface HistoryStep<T> {
	/** The data at this time in the history. */
	data: T;
	/** The most recent action taken to arrive at this state. */
	description: string;
}

/** A history of a piece of data. */
export default interface HistoryList<T> {
	/** The list of history states of the piece of data. */
	steps: Array<HistoryStep<T>>;
	/** The currently viewed position in the history. */
	position: number;
}

/**
 * Creates a copy of a history list with a new action added at the current position.
 * @param historyList The history list to add to.
 * @param f A function that changes the data and returns a description of the change.
 * @param continuedAction Whether the change is part of an already ongoing action.
 */
export function addHistory<T>(
	historyList: HistoryList<T>,
	f: (data: T) => string | boolean,
	continuedAction = false,
): HistoryList<T> {
	const newHistory = deepCopyObject(historyList);
	newHistory.steps = newHistory.steps.slice(0, newHistory.position + 1);
	const newData = deepCopyObject(newHistory.steps[newHistory.steps.length - 1].data);
	const description = f(newData);
	if (typeof description === 'boolean') return historyList;
	const newStep = {data: newData, description};
	if (continuedAction)
		newHistory.steps[newHistory.steps.length - 1] = newStep;
	else {
		newHistory.steps.push(newStep);
		newHistory.position++;
	}
	return newHistory;
}

/**
 * Creates a copy of a history list with a new position.
 * @param historyList The history list to clone.
 * @param position The new position in history to jump to.
 */
export function changeHistoryPosition<T>(
	historyList: HistoryList<T>,
	position: number,
): HistoryList<T> {
	const newHistory = deepCopyObject(historyList);
	newHistory.position = position;
	return newHistory;
}

/**
 * Gets the current state of the data in a history list.
 * @param historyList The history list to get the data from.
 */
export function getCurrentHistoryState<T>(historyList: HistoryList<T>): T {
	return historyList.steps[historyList.position].data;
}
