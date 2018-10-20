export enum LayerType {
	Geometry = 'Geometry',
}

export interface LayerItem {
	x: number;
	y: number;
}

export default interface Layer {
	name: string;
	type: LayerType;
	items: Array<LayerItem>;
}
