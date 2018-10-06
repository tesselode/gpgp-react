export enum LayerType {
	Geometry = 'geometry',
}

export interface Tile {
	readonly x: number;
	readonly y: number;
}

export default class Layer {
	readonly name: string;
	readonly type: LayerType;
	readonly tiles: ReadonlyArray<Tile>;
}
