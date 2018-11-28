import Rect from "./rect";
import { isNullOrUndefined } from "util";

class StampTile {
	public readonly positionX: number;
	public readonly positionY: number;
	public readonly tileX: number;
	public readonly tileY: number;
}

export default class Stamp {
	public readonly width: number;
	public readonly height: number;
	public readonly tiles: StampTile[];

	constructor(width: number, height: number, tiles: StampTile[]) {
		this.width = width;
		this.height = height;
		this.tiles = tiles;
	}

	public static FromRect(rect: Rect): Stamp {
		const width = rect.r - rect.l + 1;
		const height = rect.b - rect.t + 1;
		const items = [];
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				items.push({
					positionX: x,
					positionY: y,
					tileX: rect.l + x,
					tileY: rect.t + y,
				});
			}
		}
		return new Stamp(width, height, items);
	}

	public getTileAt(x: number, y: number): StampTile {
		return this.tiles.find(tile => tile.positionX === x && tile.positionY === y);
	}

	public extend(width: number, height: number) {
		const tiles = [];
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				const tile = this.getTileAt(x % this.width, y % this.height);
				if (isNullOrUndefined(tile)) continue;
				tiles.push({
					positionX: x,
					positionY: y,
					tileX: tile.tileX,
					tileY: tile.tileY,
				});
			}
		}
		return new Stamp(width, height, tiles);
	}
}
