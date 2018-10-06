import Layer, { LayerData, LayerType } from "./layer/Layer";
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

	constructor(levelData?: LevelData) {
		if (levelData) this.load(levelData);
	}

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

	load(levelData: LevelData) {
		this.width = levelData.width;
		this.height = levelData.height;
		this.layers = [];
		for (let i = 0; i < levelData.layerData.length; i++) {
			const layerData = levelData.layerData[i];
			switch (layerData.type) {
				case LayerType.Geometry:
					this.layers.push(new GeometryLayer(layerData));					
					break;
				default:
					break;
			}
		}
	}

	clone(): Level {
		return new Level(this.save());
	}
}
