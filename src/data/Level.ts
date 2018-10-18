import Layer, { LayerType } from "./layer/Layer";
import { deepCopyObject } from "../util";
import path from 'path';
import Project from "./Project";

export default interface Level {
	projectFilePath: string;
	width: number;
	height: number;
	layers: Array<Layer>;
}

export function newLevel(project: Project, projectFilePath: string): Level {
	return {
		projectFilePath: projectFilePath,
		width: project.defaultMapWidth,
		height: project.defaultMapHeight,
		layers: [
			{
				name: 'Geometry',
				type: LayerType.Geometry,
				tiles: [],
			},
		],
	}
}

export function importLevel(level: Level, levelFilePath: string): Level {
	let importedLevel = deepCopyObject(level);
	importedLevel.projectFilePath = path.resolve(path.dirname(levelFilePath), level.projectFilePath);
	return importedLevel;
}

export function exportLevel(level: Level, levelFilePath: string): Level {
	let exportedLevel = deepCopyObject(level);
	exportedLevel.projectFilePath = path.relative(path.dirname(levelFilePath), level.projectFilePath);
	return exportedLevel;
}
