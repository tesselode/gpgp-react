export enum LayerType {
	Geometry = 'geometry',
}

export interface Tile {
	readonly x: number;
	readonly y: number;
}

export default abstract class Layer {
	readonly name: string;
	readonly type: LayerType;
	readonly tiles: ReadonlyArray<Tile>;

	abstract clone(): Layer;
	abstract place(x: number, y: number, data?: Object): Layer;
	abstract remove(x: number, y: number): Layer;
}
