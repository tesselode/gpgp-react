export enum LayerType {
	Geometry = 'Geometry',
	Tile = 'Tile',
}

/** An item that can be placed on a layer. */
export interface LayerItem {
	/** The x position of the item (in tiles). */
	x: number;
	/** The y position of the item (in tiles). */
	y: number;
}

/** A surface on which items can be placed in a level. */
export default interface Layer {
	/** The name of the layer. */
	name: string;
	/** The type of the layer. */
	type: LayerType;
	/** Whether the layer is visible or not. */
	visible: boolean;
	/** The items placed on the layer. */
	items: LayerItem[];
}
