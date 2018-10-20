import Layer, { LayerItem, LayerType } from "./Layer";

export interface GeometryLayerItem extends LayerItem {}

export default interface GeometryLayer extends Layer {
	items: Array<GeometryLayerItem>;
}

export function newGeometryLayer(): GeometryLayer {
	return {
		name: 'New geometry layer',
		type: LayerType.Geometry,
		items: [],
	}
}
