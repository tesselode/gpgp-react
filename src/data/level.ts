import path from 'path';
import { deepCopyObject } from "../util";
import { newGeometryLayer } from './layer/geometry-layer';
import Layer from "./layer/layer";
import Project from "./project";

/** A level for a game. */
export default interface Level {
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

/**
 * Creates a new, empty level.
 * @param project The project the level is for.
 * @param projectFilePath The path to the project file.
 */
export function newLevel(project: Project, projectFilePath: string): Level {
	return {
		projectFilePath,
		width: project.data.defaultMapWidth,
		height: project.data.defaultMapHeight,
		layers: [newGeometryLayer()],
	};
}

/**
 * Imports a level for use after loading it from the filesystem.
 * @param level The level to import.
 * @param levelFilePath The path to the level file.
 */
export function importLevel(level: Level, levelFilePath: string): Level {
	const importedLevel = deepCopyObject(level);
	importedLevel.projectFilePath = path.resolve(path.dirname(levelFilePath), level.projectFilePath);
	return importedLevel;
}

/**
 * Exports a level to be saved as a file.
 * @param level The level to export.
 * @param levelFilePath The path the level will be saved to.
 */
export function exportLevel(level: Level, levelFilePath: string): Level {
	const exportedLevel = deepCopyObject(level);
	exportedLevel.projectFilePath = path.relative(path.dirname(levelFilePath), level.projectFilePath);
	return exportedLevel;
}
