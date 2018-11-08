import path from 'path';
import { deepCopyObject } from "../util";
import Entity from './entity';
import Tileset from "./tileset";

/** A project containing the settings for a game's levels. */
export default interface Project {
	/** The name of the project. */
	name: string;
	/** The tile size of levels in this project (in pixels). */
	tileSize: number;
	/** The default width of levels in this project (in tiles). */
	defaultMapWidth: number;
	/** The default height of levels in this project (in tiles). */
	defaultMapHeight: number;
	/** The maximum width of levels in this project (in tiles). */
	maxMapWidth: number;
	/** The maximum height of levels in this project (in tiles). */
	maxMapHeight: number;
	/** A list of the tilesets that can be used by levels in this project. */
	tilesets: Tileset[];
	/** A list of the entities that can be used by levels in this project. */
	entities: Entity[];
}

/**
 * Creates a new, empty project.
 */
export function newProject(): Project {
	return {
		name: 'New project',
		tileSize: 16,
		defaultMapWidth: 16,
		defaultMapHeight: 9,
		maxMapWidth: 1000,
		maxMapHeight: 1000,
		tilesets: [],
		entities: [],
	};
}

export function getProjectTileset(project: Project, tilesetName: string): Tileset {
	return project.tilesets.find(tileset => tileset.name === tilesetName);
}

export function getProjectEntity(project: Project, entityName: string): Entity {
	return project.entities.find(entity => entity.name === entityName);
}

/**
 * Imports a project for use after loading it from the filesystem.
 * @param project The project to import.
 * @param projectFilePath The path to the project file.
 */
export function importProject(project: Project, projectFilePath: string): Project {
	const importedProject = deepCopyObject(project);
	for (const tileset of importedProject.tilesets)
		if (tileset.imagePath)
			tileset.imagePath = path.resolve(path.dirname(projectFilePath), tileset.imagePath);
	for (const entity of importedProject.entities)
		if (entity.imagePath)
			entity.imagePath = path.resolve(path.dirname(projectFilePath), entity.imagePath);
	return importedProject;
}

/**
 * Exports a project to be saved as a file.
 * @param project The project to export.
 * @param projectFilePath The path the project will be saved to.
 */
export function exportProject(project: Project, projectFilePath: string): Project {
	const exportedProject = deepCopyObject(project);
	for (const tileset of exportedProject.tilesets)
		if (tileset.imagePath)
			tileset.imagePath = path.relative(path.dirname(projectFilePath), tileset.imagePath);
	for (const entity of exportedProject.entities)
		if (entity.imagePath)
			entity.imagePath = path.relative(path.dirname(projectFilePath), entity.imagePath);
	return exportedProject;
}
