import Layer from "./layer/Layer";
import GeometryLayer from "./layer/GeometryLayer";

export default class Level {
	width: number = 16;
	height: number = 9;
	layers: Array<Layer> = [
		new GeometryLayer(),
	];

	place(layerIndex: number, x: number, y: number, data?: object) {
		this.layers[layerIndex].place(x, y);
	}

	remove(layerIndex: number, x: number, y: number) {
		this.layers[layerIndex].remove(x, y);
	}
}
