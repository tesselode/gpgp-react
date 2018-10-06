import Cloneable from "./Cloneable";

export class HistoryStep<T extends Cloneable<T>> {
	readonly data: T;
	readonly description: string;

	constructor(data: T, description: string) {
		this.data = data;
		this.description = description;
	}

	clone(): HistoryStep<T> {
		return new HistoryStep<T>(this.data.clone(), this.description)
	}
}

export default class HistoryManager<T extends Cloneable<T>> {
	readonly steps: ReadonlyArray<HistoryStep<T>>;
	readonly position: number;

	constructor(steps: Array<HistoryStep<T>>, position: number = 0) {
		this.steps = steps;
		this.position = position;
	}

	do(f: (data: T) => string): HistoryManager<T> {
		let steps: Array<HistoryStep<T>> = [];
		for (let i = 0; i <= this.position; i++) {
			const step = this.steps[i];
			steps.push(step.clone());			
		}
		let data: T = steps[steps.length - 1].data.clone();
		let description: string = f(data);
		steps.push(new HistoryStep<T>(data, description));
		return new HistoryManager<T>(steps, this.position + 1);
	}

	current(): T {
		return this.steps[this.position].data;
	}
}
