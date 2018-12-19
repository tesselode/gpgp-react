import GeometryLayer from "./layer/geometry-layer";

type Layer = GeometryLayer;

interface LevelData {
	width: number;
	height: number;
	layers: Layer[];
}

export default class Level {
	public readonly data: LevelData;

	public static New() {
		return new Level({
			width: 16,
			height: 9,
			layers: [GeometryLayer.New()],
		});
	}

	private constructor(data: LevelData) {
		this.data = data;
	}

	public addLayer(layerIndex: number, layer: Layer) {
		const layers = this.data.layers.slice(0, this.data.layers.length);
		layers.splice(layerIndex, 0, layer);
		return new Level({...this.data, layers});
	}

	public removeLayer(layerIndex: number) {
		const layers = this.data.layers.slice(0, this.data.layers.length);
		layers.splice(layerIndex, 1);
		return new Level({...this.data, layers});
	}

	public moveLayer(currentIndex: number, newIndex: number) {
		const layers = this.data.layers.slice(0, this.data.layers.length);
		layers.splice(newIndex, 0, layers.splice(currentIndex, 1)[0]);
		return new Level({...this.data, layers});
	}

	public setLayer(layerIndex: number, layer: Layer) {
		const layers = this.data.layers.slice(0, this.data.layers.length);
		layers[layerIndex] = layer;
		return new Level({...this.data, layers});
	}
}
