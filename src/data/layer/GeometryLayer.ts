import Layer, { TileData, LayerData, LayerType } from "./Layer";

class Tile {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

export default class GeometryLayer extends Layer {
	name: string = 'New geometry layer';
	tiles: Array<Tile> = [];

	constructor(layerData?: LayerData) {
		super();
		if (layerData) this.load(layerData);
	}

	place(x: number, y: number): void {
		for (let i = 0; i < this.tiles.length; i++) {
			const tile = this.tiles[i];
			if (tile.x === x && tile.y === y) return;
		}
		this.tiles.push(new Tile(x, y));
	}

	remove(x: number, y: number): void {
		this.tiles = this.tiles.filter(tile => !(tile.x === x && tile.y === y));
	}

	save(): LayerData {
		let tileData: Array<TileData> = [];
		for (let i = 0; i < this.tiles.length; i++) {
			const tile = this.tiles[i];
			tileData.push({x: tile.x, y: tile.y});
		}
		return {
			name: this.name,
			type: LayerType.Geometry,
			tileData: tileData,
		};
	}

	load(layerData: LayerData) {
		this.name = layerData.name;
		this.tiles = [];
		for (let i = 0; i < layerData.tileData.length; i++) {
			const tileData = layerData.tileData[i];
			this.tiles.push(new Tile(tileData.x, tileData.y));
		}
	}
}
