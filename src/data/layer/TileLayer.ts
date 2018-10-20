import Layer, { LayerItem, LayerType } from "./Layer";

export interface TileLayerItem extends LayerItem {
	tileX: number;
	tileY: number;
}

export default interface TileLayer extends Layer {
	tilesetName: string;
	items: Array<TileLayerItem>;
}

export function newTileLayer(tilesetName: string): TileLayer {
	return {
		name: 'New tile layer',
		type: LayerType.Tile,
		tilesetName: tilesetName,
		items: [],
	}
}

export function isTileLayer(layer: Layer): layer is TileLayer {
	return layer.type === LayerType.Tile;
}
