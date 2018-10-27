import path from 'path';
import { deepCopyObject } from "../util";
import { newGeometryLayer } from './layer/geometry-layer';
import Layer from "./layer/layer";
import Project from "./project";

export default interface Level {
	projectFilePath: string;
	width: number;
	height: number;
	layers: Layer[];
}

export function newLevel(project: Project, projectFilePath: string): Level {
	return {
		projectFilePath,
		width: project.defaultMapWidth,
		height: project.defaultMapHeight,
		layers: [newGeometryLayer()],
	};
}

export function importLevel(level: Level, levelFilePath: string): Level {
	const importedLevel = deepCopyObject(level);
	importedLevel.projectFilePath = path.resolve(path.dirname(levelFilePath), level.projectFilePath);
	return importedLevel;
}

export function exportLevel(level: Level, levelFilePath: string): Level {
	const exportedLevel = deepCopyObject(level);
	exportedLevel.projectFilePath = path.relative(path.dirname(levelFilePath), level.projectFilePath);
	return exportedLevel;
}
