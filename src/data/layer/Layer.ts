export enum LayerType {
	Geometry = 'Geometry',
}

export interface TileData {
	x: number,
	y: number,
}

export interface LayerData {
	name: string,
	type: LayerType,
	tileData: Array<TileData>,
}

export default abstract class Layer {
	name: string = 'New layer';
	tiles: Array<object> = [];

	abstract place(x: number, y: number, tile?: object): void;
	abstract remove(x: number, y: number): void;
	abstract save(): LayerData;
	abstract load(layerData: LayerData): void;
}
