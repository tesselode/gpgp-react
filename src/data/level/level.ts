import path from 'path';
import EntityLayer, { ExportedEntityLayerData } from './layer/entity-layer';
import GeometryLayer, { ExportedGeometryLayerData } from "./layer/geometry-layer";
import TileLayer, { ExportedTileLayerData } from "./layer/tile-layer";
import Project from "../project/project";

export type Layer = GeometryLayer | TileLayer | EntityLayer;
export type ExportedLayerData = ExportedGeometryLayerData |
	ExportedTileLayerData | ExportedEntityLayerData;

export interface LevelData {
	/** The absolute path to the associated project file. */
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

export interface ExportedLevelData {
	/** The relative path to the associated project file. */
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
	layers: ExportedLayerData[];
}

export default class Level {
	public readonly project: Project;
	public readonly data: LevelData;

	public static New(project: Project, projectFilePath: string): Level {
		return new Level(project, {
			projectFilePath,
			width: project.data.defaultMapWidth,
			height: project.data.defaultMapHeight,
			layers: [GeometryLayer.New()],
		});
	}

	public static Import(project: Project, levelFilePath: string, data: ExportedLevelData): Level {
		const layers: Layer[] = [];
		for (const layerData of data.layers) {
			switch (layerData.type) {
				case 'Geometry':
					layers.push(GeometryLayer.Import(layerData));
					break;
				case 'Tile':
					layers.push(TileLayer.Import(layerData));
					break;
				case 'Entity':
					layers.push(EntityLayer.Import(layerData, project));
					break;
			}
		}
		const level = new Level(project, {
			projectFilePath: path.resolve(path.dirname(levelFilePath), data.projectFilePath),
			width: data.width,
			height: data.height,
			hasBackgroundColor: data.hasBackgroundColor,
			backgroundColor: data.backgroundColor,
			layers,
		});
		console.log('imported level: ', level);
		return level;
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
		layers.push(GeometryLayer.New());
		return new Level(this.project, {...this.data, layers});
	}

	public addTileLayer(tilesetName: string): Level {
		const layers = this.data.layers.slice(0, this.data.layers.length);
		layers.push(TileLayer.New(tilesetName));
		return new Level(this.project, {...this.data, layers});
	}

	public addEntityLayer(): Level {
		const layers = this.data.layers.slice(0, this.data.layers.length);
		layers.push(EntityLayer.New());
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

	public export(levelFilePath: string): ExportedLevelData {
		return {
			projectFilePath: path.relative(path.dirname(levelFilePath), this.data.projectFilePath),
			width: this.data.width,
			height: this.data.height,
			hasBackgroundColor: this.data.hasBackgroundColor,
			backgroundColor: this.data.backgroundColor,
			layers: this.data.layers.map(layer => layer.export()),
		};
	}
}
