import * as PIXI from 'pixi.js';
import React from 'react';

export default class App extends React.Component {
	private pixiApp = new PIXI.Application({
		width: 500,
		height: 500,
		transparent: true,
	});
	private containerRef = React.createRef<HTMLDivElement>();

	public componentDidMount() {
		this.containerRef.current.appendChild(this.pixiApp.view);
	}

	public render() {
		return <div
			ref={this.containerRef}
		/>;
	}
}
