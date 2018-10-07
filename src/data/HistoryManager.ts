export interface Cloneable<T> {
	clone: () => T;
}

export interface HistoryStep<T extends Cloneable<T>> {
	readonly data: T;
	readonly description: string;
}

export default class HistoryManager<T extends Cloneable<T>> {
	readonly steps: ReadonlyArray<HistoryStep<T>>;
	readonly position: number;

	constructor(
		steps: ReadonlyArray<HistoryStep<T>>,
		position: number = 0
	) {
		this.steps = steps;
		this.position = position;
	}

	do(f: (data: T) => HistoryStep<T>): HistoryManager<T> {
		let steps: Array<HistoryStep<T>> = [];
		for (let i = 0; i <= this.position; i++) {
			const step = this.steps[i];
			steps.push({
				data: step.data.clone(),
				description: step.description,
			});
		}
		steps.push(f(steps[steps.length - 1].data));
		return new HistoryManager<T>(steps, this.position + 1);
	}

	current(): T {
		return this.steps[this.position].data;
	}
}
