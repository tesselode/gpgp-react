import Layer, { LayerItem, LayerType } from "./layer";

export interface TileLayerItem extends LayerItem {
	tileX: number;
	tileY: number;
}

export default interface TileLayer extends Layer {
	tilesetIndex: number;
	items: Array<TileLayerItem>;
}

export function newTileLayer(tilesetIndex: number): TileLayer {
	return {
		name: 'New tile layer',
		type: LayerType.Tile,
		visible: true,
		tilesetIndex: tilesetIndex,
		items: [],
	}
}

export function isTileLayer(layer: Layer): layer is TileLayer {
	return layer.type === LayerType.Tile;
}
