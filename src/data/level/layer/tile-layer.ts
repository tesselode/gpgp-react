import { EditTool } from "../../../ui/level-editor/edit-tool";
import Rect from "../../rect";

export interface TileLayerItem {
	readonly x: number;
	readonly y: number;
	readonly tileX: number;
	readonly tileY: number;
}

export interface TileLayerData {
	readonly name: string;
	readonly tilesetName: string;
	readonly visible: boolean;
	readonly items: TileLayerItem[];
}

export interface ExportedTileLayerData {
	name: string;
	type: 'Tile';
	tilesetName: string;
	visible: boolean;
	items: TileLayerItem[];
}

export default class TileLayer {
	public readonly data: TileLayerData;

	public static New(tilesetName: string) {
		return new TileLayer({
			name: 'New tile layer',
			tilesetName,
			visible: true,
			items: [],
		});
	}

	public static Import(data: ExportedTileLayerData) {
		return new TileLayer(data);
	}

	private constructor(data: TileLayerData) {
		this.data = data;
	}

	public setName(name: string): TileLayer {
		return new TileLayer({...this.data, name});
	}

	public setTilesetName(tilesetName: string): TileLayer {
		return new TileLayer({...this.data, tilesetName});
	}

	public toggleVisibility(): TileLayer {
		return new TileLayer({...this.data, visible: !this.data.visible});
	}

	public remove(rect: Rect): TileLayer {
		return new TileLayer({...this.data,
			items: this.data.items.filter(item =>
				item.x < rect.l || item.x > rect.r || item.y < rect.t || item.y > rect.b),
		});
	}

	public place(tool: EditTool, rect: Rect, tiles: Rect): TileLayer {
		const items = this.data.items.filter(item =>
			item.x < rect.l || item.x > rect.r || item.y < rect.t || item.y > rect.b);
		switch (tool) {
			case EditTool.Rectangle:
				let tileX = tiles.l - 1;
				for (let x = rect.l; x <= rect.r; x++) {
					tileX++;
					if (tileX > tiles.r) tileX = tiles.l;
					let tileY = tiles.t - 1;
					for (let y = rect.t; y <= rect.b; y++) {
						tileY++;
						if (tileY > tiles.b) tileY = tiles.t;
						items.push({x, y, tileX, tileY});
					}
				}
				break;
			default:
				for (let tileX = tiles.l; tileX <= tiles.r; tileX++) {
					for (let tileY = tiles.t; tileY <= tiles.b; tileY++) {
						items.push({
							x: rect.l + (tileX - tiles.l),
							y: rect.t + (tileY - tiles.t),
							tileX,
							tileY,
						});
					}
				}
				break;
		}
		return new TileLayer({...this.data, items});
	}

	public export(): ExportedTileLayerData {
		return {...this.data, type: 'Tile'};
	}
}
