import { Rect } from "../../util";
import Layer, { LayerItem, LayerType } from "./layer";

/** A layer on which geometry can be placed. This is useful for marking where collisions occur in a game. */
export default interface GeometryLayer extends Layer {
	items: LayerItem[];
}

/** Creates a new, empty geometry layer. */
export function newGeometryLayer(): GeometryLayer {
	return {
		name: 'New geometry layer',
		type: LayerType.Geometry,
		visible: true,
		items: [],
	};
}

/**
 * Returns if a layer is a geometry layer.
 * @param layer The layer to check.
 */
export function isGeometryLayer(layer: Layer): layer is GeometryLayer {
	return layer.type === LayerType.Geometry;
}

/**
 * Removes geometry from a geometry layer.
 * @param layer The layer to remove geometry from.
 * @param rect The region to remove geometry from.
 */
export function removeGeometry(layer: GeometryLayer, rect: Rect) {
	layer.items = layer.items.filter(item => item.x < rect.l || item.x > rect.r || item.y < rect.t || item.y > rect.b);
}

/**
 * Places geometry on a geometry layer.
 * @param layer The layer to place geometry on.
 * @param rect The region to place geometry in.
 */
export function placeGeometry(layer: GeometryLayer, rect: Rect) {
	removeGeometry(layer, rect);
	for (let x = rect.l; x <= rect.r; x++) {
		for (let y = rect.t; y <= rect.b; y++) {
			layer.items.push({x, y});
		}
	}
}
