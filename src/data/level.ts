import GeometryLayer from "./layer/geometry-layer";
import TileLayer from "./layer/tile-layer";
import Project from "./project";

export type Layer = GeometryLayer | TileLayer;

export interface LevelData {
	/** The path to the associated project file. */
	projectFilePath: string;
	/** The width of the level (in tiles). */
	width: number;
	/** The height of the level (in tiles). */
	height: number;
	/** Whether the level has a background color. */
	hasBackgroundColor?: boolean;
	/** The background color of the level. */
	backgroundColor?: string;
	/** The layers the level is made up of. */
	layers: Layer[];
}

export default class Level {
	public readonly project: Project;
	public readonly data: LevelData;

	public static New(project: Project, projectFilePath: string) {
		return new Level(project, {
			projectFilePath,
			width: project.data.defaultMapWidth,
			height: project.data.defaultMapHeight,
			layers: [new GeometryLayer()],
		});
	}

	private constructor(project: Project, data: LevelData) {
		this.project = project;
		this.data = data;
	}

	public setWidth(width: number): Level {
		return new Level(this.project, {...this.data, width});
	}

	public setHeight(height: number): Level {
		return new Level(this.project, {...this.data, height});
	}

	public toggleHasBackgroundColor(): Level {
		return new Level(this.project, {
			...this.data,
			hasBackgroundColor: !this.data.hasBackgroundColor,
		});
	}

	public setBackgroundColor(backgroundColor: string): Level {
		return new Level(this.project, {...this.data, backgroundColor});
	}

	public addGeometryLayer(): Level {
		const layers = this.data.layers.slice(0, this.data.layers.length);
		layers.push(new GeometryLayer());
		return new Level(this.project, {...this.data, layers});
	}

	public addTileLayer(tilesetName: string): Level {
		const layers = this.data.layers.slice(0, this.data.layers.length);
		layers.push(TileLayer.New(tilesetName));
		return new Level(this.project, {...this.data, layers});
	}

	public removeLayer(layerIndex: number): Level {
		if (this.data.layers.length === 0) return this;
		const layers = this.data.layers.slice(0, this.data.layers.length);
		layers.splice(layerIndex, 1);
		return new Level(this.project, {...this.data, layers});
	}

	public moveLayerUp(layerIndex: number): Level {
		if (!(layerIndex > 0 && this.data.layers[layerIndex])) return this;
		const layers = this.data.layers.slice(0, this.data.layers.length);
		layers.splice(layerIndex - 1, 0, layers.splice(layerIndex, 1)[0]);
		return new Level(this.project, {...this.data, layers});
	}

	public moveLayerDown(layerIndex: number): Level {
		if (!(layerIndex < this.data.layers.length - 1 && this.data.layers[layerIndex])) return this;
		const layers = this.data.layers.slice(0, this.data.layers.length);
		layers.splice(layerIndex + 1, 0, layers.splice(layerIndex, 1)[0]);
		return new Level(this.project, {...this.data, layers});
	}

	public setLayer(layerIndex: number, layer: Layer): Level {
		const layers = this.data.layers.slice(0, this.data.layers.length);
		layers[layerIndex] = layer;
		return new Level(this.project, {...this.data, layers});
	}
}
