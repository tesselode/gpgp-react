import Layer from "./Layer";

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
}
