import * as PIXI from 'pixi.js';
import React from 'react';

export default class App extends React.Component<{}> {
	private pixiApp = new PIXI.Application({
		width: 500,
		height: 500,
		transparent: true,
	});
	private containerRef = React.createRef<HTMLDivElement>();

	constructor(props: {}) {
		super(props);
	}

	public componentDidMount() {
		this.containerRef.current.appendChild(this.pixiApp.view);
		PIXI.loader
			.add([
				'D:/Programming/gpgp-react/assets/seasonal platformer/fall.png',
			])
			.load(() => {
				const texture = PIXI.loader.resources['D:/Programming/gpgp-react/assets/seasonal platformer/fall.png'].texture;
				texture.frame = new PIXI.Rectangle(16, 64, 16, 16);
				const sprite = new PIXI.Sprite(texture);
				sprite.x = 64;
				sprite.y = 64;
				this.pixiApp.stage.scale = new PIXI.Point(4, 4);
				this.pixiApp.stage.addChild(sprite);
			});
	}

	public render() {
		return <div
			ref={this.containerRef}
		/>;
	}
}
