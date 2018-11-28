import { EditTool } from "../../../ui/level-editor/edit-tool";
import Rect from "../../rect";
import Stamp from "../../stamp";

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

	public place(tool: EditTool, rect: Rect, stamp: Stamp) {
		const items = this.data.items.filter(item =>
			item.x < rect.l || item.x > rect.r || item.y < rect.t || item.y > rect.b);
		switch (tool) {
			case EditTool.Pencil:
				stamp.tiles.forEach(tile => {
					items.push({
						x: tile.positionX + rect.l,
						y: tile.positionY + rect.t,
						tileX: tile.tileX,
						tileY: tile.tileY,
					});
				});
				break;
			case EditTool.Rectangle:
				const extendedStamp = stamp.extend(rect.r - rect.l + 1, rect.b - rect.t + 1);
				extendedStamp.tiles.forEach(tile => {
					items.push({
						x: tile.positionX + rect.l,
						y: tile.positionY + rect.t,
						tileX: tile.tileX,
						tileY: tile.tileY,
					});
				});
				break;
		}
		return new TileLayer({...this.data, items});
	}

	public export(): ExportedTileLayerData {
		return {...this.data, type: 'Tile'};
	}
}
