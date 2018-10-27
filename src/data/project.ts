import path from 'path';
import { deepCopyObject } from "../util";
import Tileset from "./tileset";

export default interface Project {
	name: string;
	tileSize: number;
	defaultMapWidth: number;
	defaultMapHeight: number;
	maxMapWidth: number;
	maxMapHeight: number;
	tilesets: Tileset[];
}

export function newProject(): Project {
	return {
		name: 'New project',
		tileSize: 16,
		defaultMapWidth: 16,
		defaultMapHeight: 9,
		maxMapWidth: 1000,
		maxMapHeight: 1000,
		tilesets: [],
	};
}

export function importProject(project: Project, projectFilePath: string): Project {
	const importedProject = deepCopyObject(project);
	for (const tileset of importedProject.tilesets)
		tileset.imagePath = path.resolve(path.dirname(projectFilePath), tileset.imagePath);
	return importedProject;
}

export function exportProject(project: Project, projectFilePath: string): Project {
	const exportedProject = deepCopyObject(project);
	for (const tileset of exportedProject.tilesets)
		tileset.imagePath = path.relative(path.dirname(projectFilePath), tileset.imagePath);
	return exportedProject;
}
