import * as PIXI from 'pixi.js';
import GeometryLayer from '../../data/layer/geometry-layer';

export default class GeometryLayerDisplay {
	public container = new PIXI.Container();
	private masterTile = new PIXI.Graphics();
	private layer: GeometryLayer;

	private drawMasterTile() {
		this.masterTile.beginFill(0xff0000, 1 / 3);
		this.masterTile.drawRect(0, 0, 1, 1);
		this.masterTile.endFill();
	}

	private placeTile(x: number, y: number) {
		const tile = this.masterTile.clone();
		tile.x = x;
		tile.y = y;
		this.container.addChild(tile);
	}

	private removeTile(x: number, y: number) {
		this.container.children.forEach(child => {
			if (child.x === x && child.y === y)
				this.container.removeChild(child);
		});
	}

	constructor(layer: GeometryLayer) {
		this.layer = layer;
		this.drawMasterTile();
		layer.data.items.forEach(item => {
			this.placeTile(item.x, item.y);
		});
	}

	public update(layer: GeometryLayer) {
		this.layer.data.items.forEach(item => {
			if (!layer.hasItemAt(item.x, item.y)) {
				this.removeTile(item.x, item.y);
			}
		});
		layer.data.items.forEach(item => {
			if (!this.layer.hasItemAt(item.x, item.y)) {
				this.placeTile(item.x, item.y);
			}
		});
		this.layer = layer;
	}
}
