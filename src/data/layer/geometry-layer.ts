import Layer, { LayerItem, LayerType } from "./layer";

export interface GeometryLayerItem extends LayerItem {}

export default interface GeometryLayer extends Layer {
	items: Array<GeometryLayerItem>;
}

export function newGeometryLayer(): GeometryLayer {
	return {
		name: 'New geometry layer',
		type: LayerType.Geometry,
		visible: true,
		items: [],
	}
}
