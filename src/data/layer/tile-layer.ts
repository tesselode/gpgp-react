import Layer, { LayerItem, LayerType } from "./layer";
import { Rect } from "../../util";
import { GridTool } from "../../ui/grid";

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

export function placeTile(tool: GridTool, layer: TileLayer, rect: Rect, tiles: Rect) {
	removeTile(layer, rect);
	switch (tool) {
		case GridTool.Rectangle:
			let tileX = tiles.l - 1;
			for (let x = rect.l; x <= rect.r; x++) {
				tileX++;
				if (tileX > tiles.r) tileX = tiles.l;
				let tileY = tiles.t - 1;
				for (let y = rect.t; y <= rect.b; y++) {
					tileY++;
					if (tileY > tiles.b) tileY = tiles.t;
					layer.items.push({x: x, y: y, tileX: tileX, tileY: tileY});
				}
			}
			break;
		default:
			for (let tileX = tiles.l; tileX <= tiles.r; tileX++) {
				for (let tileY = tiles.t; tileY <= tiles.b; tileY++) {
					layer.items.push({
						x: rect.l + (tileX - tiles.l),
						y: rect.t + (tileY - tiles.t),
						tileX: tileX,
						tileY: tileY,
					});
				}
			}
			break;
	}
}
