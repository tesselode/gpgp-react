export interface HistoryStep<T> {
	readonly state: T;
	readonly description: string;
}

export default class HistoryList<T> {
	public readonly steps: Array<HistoryStep<T>>;
	public readonly position;

	public static New<T>(state: T, description: string): HistoryList<T> {
		return new HistoryList<T>([{state, description}], 0);
	}

	private constructor(steps: Array<HistoryStep<T>>, position: number) {
		this.steps = steps;
		this.position = position;
	}

	public addState(state: T, description: string, replace?: boolean): HistoryList<T> {
		const newStep = {state, description};
		const steps = this.steps.slice(0, this.position + 1);
		if (replace)
			steps[steps.length - 1] = newStep;
		else
			steps.push(newStep);
		return new HistoryList<T>(steps, steps.length - 1);
	}

	public jump(position: number): HistoryList<T> {
		return new HistoryList<T>(this.steps, position);
	}

	public undo(): HistoryList<T> {
		return this.jump(Math.max(0, this.position - 1));
	}

	public redo(): HistoryList<T> {
		return this.jump(Math.min(this.steps.length - 1, this.position + 1));
	}

	public getCurrentState(): T {
		return this.steps[this.position].state;
	}
}
