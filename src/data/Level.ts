import Layer, { LayerData } from "./layer/Layer";
import GeometryLayer from "./layer/GeometryLayer";

export interface LevelData {
	width: number,
	height: number,
	layerData: Array<LayerData>,
}

export default class Level {
	width: number = 16;
	height: number = 9;
	layers: Array<Layer> = [
		new GeometryLayer(),
	];

	place(layerIndex: number, x: number, y: number, data?: object): void {
		this.layers[layerIndex].place(x, y);
	}

	remove(layerIndex: number, x: number, y: number): void {
		this.layers[layerIndex].remove(x, y);
	}

	save(): LevelData {
		let layerData: Array<LayerData> = [];
		for (let i = 0; i < this.layers.length; i++) {
			const layer = this.layers[i];
			layerData.push(layer.save());
		}
		return {
			width: this.width,
			height: this.height,
			layerData: layerData,
		}
	}
}
