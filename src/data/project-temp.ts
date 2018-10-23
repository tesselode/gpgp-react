import Tileset from "./Tileset";
import { deepCopyObject } from "../util";
import path from 'path';

export default interface Project {
	name: string;
	tileSize: number;
	defaultMapWidth: number;
	defaultMapHeight: number;
	maxMapWidth: number;
	maxMapHeight: number;
	tilesets: Array<Tileset>;
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
	}
}

export function importProject(project: Project, projectFilePath: string): Project {
	let importedProject = deepCopyObject(project);
	for (let i = 0; i < importedProject.tilesets.length; i++) {
		const tileset = importedProject.tilesets[i];
		tileset.imagePath = path.resolve(path.dirname(projectFilePath), tileset.imagePath);
	}
	return importedProject;
}

export function exportProject(project: Project, projectFilePath: string): Project {
	let exportedProject = deepCopyObject(project);
	for (let i = 0; i < exportedProject.tilesets.length; i++) {
		const tileset = exportedProject.tilesets[i];
		tileset.imagePath = path.relative(path.dirname(projectFilePath), tileset.imagePath);
	}
	return exportedProject;
}
