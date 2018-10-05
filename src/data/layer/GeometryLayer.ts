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
	data: Array<Tile> = [];

	place(x: number, y: number) {
		for (let i = 0; i < this.data.length; i++) {
			const tile = this.data[i];
			if (tile.x === x && tile.y === y) return;
		}
		this.data.push(new Tile(x, y));
	}

	remove(x: number, y: number) {
		this.data = this.data.filter(tile => tile.x !== x && tile.y !== y);
	}
}
