import { Rect } from "../../util";
import Layer, { LayerItem, LayerType } from "./layer";

export default interface GeometryLayer extends Layer {
	items: LayerItem[];
}

export function newGeometryLayer(): GeometryLayer {
	return {
		name: 'New geometry layer',
		type: LayerType.Geometry,
		visible: true,
		items: [],
	};
}

export function isGeometryLayer(layer: Layer): layer is GeometryLayer {
	return layer.type === LayerType.Geometry;
}

export function removeGeometry(layer: GeometryLayer, rect: Rect) {
	layer.items = layer.items.filter(item => item.x < rect.l || item.x > rect.r || item.y < rect.t || item.y > rect.b);
}

export function placeGeometry(layer: GeometryLayer, rect: Rect) {
	removeGeometry(layer, rect);
	for (let x = rect.l; x <= rect.r; x++) {
		for (let y = rect.t; y <= rect.b; y++) {
			layer.items.push({x, y});
		}
	}
}
