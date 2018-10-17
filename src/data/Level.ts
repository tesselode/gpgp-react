import Layer, { LayerType } from "./layer/Layer";

export default interface Level {
	width: number;
	height: number;
	layers: Array<Layer>;
}

export function newLevel(): Level {
	return {
		width: 16,
		height: 9,
		layers: [
			{
				name: 'Geometry',
				type: LayerType.Geometry,
				tiles: [],
			},
		],
	}
}
