import Cloneable from "./Cloneable";

interface HistoryStep<T extends Cloneable<T>> {
	data: T;
	description: string;
}

export default class HistoryManager<T extends Cloneable<T>> {
	steps: Array<HistoryStep<T>> = [];
	position: number = 0;

	constructor(data: T, description: string) {
		this.steps.push({data: data, description: description});
	}

	private clone(position: number): HistoryManager<T> {
		let historyManager = new HistoryManager<T>(this.steps[0].data.clone(), this.steps[0].description);
		historyManager.position = position;
		for (let i = 1; i <= position; i++) {
			const step = this.steps[i];
			historyManager.steps.push({data: step.data.clone(), description: step.description});
		}
		return historyManager;
	}

	do(f: (data: T) => string): HistoryManager<T> {
		let historyManager = this.clone(this.position);
		let data: T = historyManager.current().clone();
		let description: string = f(data);
		historyManager.steps.push({data: data, description: description});
		historyManager.position++;
		return historyManager;
	}

	current(): T {
		return this.steps[this.position].data;
	}
}
