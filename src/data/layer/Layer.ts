export enum LayerType {
	Geometry = 'Geometry',
}

export interface Tile {
	x: number;
	y: number;
}

export default interface Layer {
	name: string;
	type: LayerType;
	tiles: Array<Tile>;
}
