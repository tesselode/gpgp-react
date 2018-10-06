import Layer, { LayerType, Tile } from "./Layer";

export default class GeometryLayer extends Layer {
	readonly name: string;
	readonly type: LayerType = LayerType.Geometry;
	readonly tiles: ReadonlyArray<Tile>;

	constructor(name: string, tiles: ReadonlyArray<Tile> = []) {
		super();
		this.name = name;
		this.tiles = tiles;
	}

	place(x, y): GeometryLayer {
		let tiles: Array<Tile> = [];
		let tileAlreadyAtPosition: boolean = false;
		this.tiles.forEach(tile => {
			tiles.push({x: tile.x, y: tile.y});
			if (tile.x === x && tile.y === y)
				tileAlreadyAtPosition = true;
		});
		if (tileAlreadyAtPosition)
			return new GeometryLayer(this.name, tiles);
		tiles.push({x: x, y: y});
		return new GeometryLayer(this.name, tiles);
	}

	remove(x, y): GeometryLayer {
		let tiles: Array<Tile> = [];
		this.tiles.forEach(tile => {
			if (!(tile.x === x && tile.y === y))
				tiles.push({x: tile.x, y: tile.y});
		});
		return new GeometryLayer(this.name, tiles);
	}
}
