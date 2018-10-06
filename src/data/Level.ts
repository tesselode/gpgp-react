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
}
