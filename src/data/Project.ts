import Tileset from "./Tileset";

export default interface Project {
	tileSize: number;
	defaultMapWidth: number;
	defaultMapHeight: number;
	maxMapWidth: number;
	maxMapHeight: number;
	tilesets: Array<Tileset>;
}
