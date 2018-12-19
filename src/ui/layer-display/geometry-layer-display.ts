import * as PIXI from 'pixi.js';

export default class GeometryLayerDisplay {
	public container = new PIXI.Container();

	constructor() {
		const tile = new PIXI.Graphics();
		tile.beginFill(0xff0000, 1 / 3);
		tile.drawRect(4, 4, 1, 1);
		tile.endFill();
		this.container.addChild(tile);
	}
}
