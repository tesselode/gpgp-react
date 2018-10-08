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

	private cloneSteps(position: number = this.steps.length - 1): Array<HistoryStep<T>> {
		let steps: Array<HistoryStep<T>> = [];
		for (let i = 0; i <= position; i++) {
			const step = this.steps[i];
			steps.push({
				data: step.data.clone(),
				description: step.description,
			});
		}
		return steps;
	}

	do(f: (data: T) => HistoryStep<T>, continuedAction = false): HistoryManager<T> {
		let steps = this.cloneSteps(this.position);
		let newStep = f(steps[steps.length - 1].data);
		if (continuedAction)
			steps[steps.length - 1] = newStep;
		else
			steps.push(newStep);
		return new HistoryManager<T>(steps, steps.length - 1);
	}

	jumpTo(position: number): HistoryManager<T> {
		let steps = this.cloneSteps();
		return new HistoryManager<T>(steps, position);
	}

	current(): T {
		return this.steps[this.position].data;
	}
}
