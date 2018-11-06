import { EditTool } from "../../ui/level-editor/edit-tool";
import { Rect } from "../../util";
import Layer, { LayerItem, LayerType } from "./layer";

/** A tile that can be placed on a tile layer. */
export interface TileLayerItem extends LayerItem {
	/** The x position of the tile in the tileset (in tiles). */
	tileX: number;
	/** The y position of the tile in the tileset (in tiles). */
	tileY: number;
}

/** A layer on which tiles can be placed. Generally used for arranging the visual decorations in a level. */
export default interface TileLayer extends Layer {
	/** The name of the tileset used by this layer.. */
	tilesetName: string;
	/** The tiles placed on the layer. */
	items: TileLayerItem[];
}

/**
 * Creates a new, empty tile layer.
 * @param tilesetName The name of the layer to use.
 */
export function newTileLayer(tilesetName: string): TileLayer {
	return {
		name: 'New tile layer',
		type: LayerType.Tile,
		visible: true,
		tilesetName,
		items: [],
	};
}

/**
 * Returns whether a layer is a tile layer.
 * @param layer The layer to check.
 */
export function isTileLayer(layer: Layer): layer is TileLayer {
	return layer.type === LayerType.Tile;
}

/**
 * Removes a tile from a tile layer.
 * @param layer The tile layer to remove.
 * @param rect The rectangle to remove tiles within.
 */
export function removeTile(layer: TileLayer, rect: Rect) {
	layer.items = layer.items.filter(item => item.x < rect.l || item.x > rect.r || item.y < rect.t || item.y > rect.b);
}

/**
 * Places a tile on a tile layer.
 * @param tool The editing tool that is currently being used.
 * @param layer The layer to place a tile on.
 * @param rect The region of the layer to place tiles on.
 * @param tiles The region on the tileset to pull tiles from.
 */
export function placeTile(tool: EditTool, layer: TileLayer, rect: Rect, tiles: Rect) {
	removeTile(layer, rect);
	switch (tool) {
		case EditTool.Rectangle:
			let tileX = tiles.l - 1;
			for (let x = rect.l; x <= rect.r; x++) {
				tileX++;
				if (tileX > tiles.r) tileX = tiles.l;
				let tileY = tiles.t - 1;
				for (let y = rect.t; y <= rect.b; y++) {
					tileY++;
					if (tileY > tiles.b) tileY = tiles.t;
					layer.items.push({x, y, tileX, tileY});
				}
			}
			break;
		default:
			for (let tileX = tiles.l; tileX <= tiles.r; tileX++) {
				for (let tileY = tiles.t; tileY <= tiles.b; tileY++) {
					layer.items.push({
						x: rect.l + (tileX - tiles.l),
						y: rect.t + (tileY - tiles.t),
						tileX,
						tileY,
					});
				}
			}
			break;
	}
}
