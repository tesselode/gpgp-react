import Layer, { LayerItem, LayerType } from "./layer";
import { Rect } from "../../util";

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

export function removeTile(layer: TileLayer, rect: Rect) {
	layer.items = layer.items.filter(item => item.x < rect.l || item.x > rect.r || item.y < rect.t || item.y > rect.b);
}

export function placeTile(layer: TileLayer, rect: Rect, tileX: number, tileY: number) {
	removeTile(layer, rect);
	for (let x = rect.l; x <= rect.r; x++) {
		for (let y = rect.t; y <= rect.b; y++) {
			layer.items.push({x: x, y: y, tileX: tileX, tileY: tileY});
		}
	}
}
