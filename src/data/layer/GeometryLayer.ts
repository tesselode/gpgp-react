import Layer, { Tile, LayerType } from "./Layer";

export interface GeometryTile extends Tile {}

export default interface GeometryLayer extends Layer {
	tiles: Array<GeometryTile>;
}

export function newGeometryLayer(): GeometryLayer {
	return {
		name: 'New geometry layer',
		type: LayerType.Geometry,
		tiles: new Array<GeometryTile>(),
	}
}
