import Layer, { Tile } from "./Layer";

export interface GeometryTile extends Tile {}

export default interface GeometryLayer extends Layer {
	tiles: Array<GeometryTile>;
}
