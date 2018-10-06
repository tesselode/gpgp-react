import Project from "./Project";
import Layer from "./layer/Layer";
import GeometryLayer from "./layer/GeometryLayer";

export default class Level {
	readonly project: Project;
	readonly width: number;
	readonly height: number;
	readonly layers: ReadonlyArray<Layer>;

	constructor(
		project: Project,
		width: number,
		height: number,
		layers: ReadonlyArray<Layer> = [
			new GeometryLayer('New geometry layer')
		]
	) {
		this.project = project;
		this.width = width;
		this.height = height;
		this.layers = layers;
	}

	place(layerIndex: number, x: number, y: number, data?: Object): Level {
		let layers: Array<Layer> = [];
		this.layers.forEach((layer, i) => {
			layers.push(i === layerIndex ? layer.place(x, y, data) : layer.clone())
		})
		return new Level(this.project.clone(), this.width, this.height, layers);
	}
	
	remove(layerIndex: number, x: number, y: number): Level {
		let layers: Array<Layer> = [];
		this.layers.forEach((layer, i) => {
			layers.push(i === layerIndex ? layer.remove(x, y) : layer.clone())
		})
		return new Level(this.project.clone(), this.width, this.height, layers);
	}
}
