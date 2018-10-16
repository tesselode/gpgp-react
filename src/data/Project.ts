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
