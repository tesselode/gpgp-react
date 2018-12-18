import * as PIXI from 'pixi.js';
import React from 'react';

export default class GeometryLayerDisplay extends React.Component {
	public container = new PIXI.Container();

	public componentDidMount() {
		const tile = new PIXI.Graphics();
		tile.beginFill(0xff0000, 1 / 3);
		tile.drawRect(4, 4, 1, 1);
		tile.endFill();
		this.container.addChild(tile);
	}

	public render(): null {return null; }
}
