import Cloneable from "./Cloneable";

class HistoryStep<T> {
	data: T;
	description: string;
	constructor(data: T, description: string) {
		this.data = data;
		this.description = description;
	}
}

export default class HistoryManager<T extends Cloneable<T>> {
	steps: Array<HistoryStep<T>> = [];
	position: number = 0;

	constructor(data: T, description: string) {
		this.steps.push(new HistoryStep<T>(data, description));
	}

	do(f: (data: T) => string): void {
		this.steps = this.steps.slice(0, this.position + 1);
		let data: T = this.steps[this.steps.length - 1].data.clone();
		let description: string = f(data);
		this.steps.push(new HistoryStep<T>(data, description));
		this.position++;
		console.log(this.position);
	}

	current(): T {
		return this.steps[this.position].data;
	}
}
