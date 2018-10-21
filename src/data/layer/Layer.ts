export enum LayerType {
	Geometry = 'Geometry',
	Tile = 'Tile',
}

export interface LayerItem {
	x: number;
	y: number;
}

export default interface Layer {
	name: string;
	type: LayerType;
	visible: boolean;
	items: Array<LayerItem>;
}
