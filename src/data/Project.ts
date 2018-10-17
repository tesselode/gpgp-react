import Tileset from "./Tileset";

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
