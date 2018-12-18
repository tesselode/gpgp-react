import * as PIXI from 'pixi.js';
import React from 'react';
import GeometryLayerDisplay from './layer/geometry';

type LayerDisplay = GeometryLayerDisplay;

interface Props {
	/** The width of the space available for the grid. */
	viewportWidth: number;
	/** The height of the space available for the grid. */
	viewportHeight: number;
	/** The width of the grid (in tiles). */
	width: number;
	/** The height of the grid (in tiles). */
	height: number;
	/** The content to display in the grid. */
	layers?: Array<React.RefObject<LayerDisplay>>;
}

/** An interactive grid that can display content. */
export default class Grid extends React.Component<Props> {
	private pixiApp: PIXI.Application;
	private containerRef = React.createRef<HTMLDivElement>();
	private zoom = 16;

	constructor(props: Props) {
		super(props);
		this.pixiApp = new PIXI.Application({
			width: props.viewportWidth,
			height: props.viewportHeight,
			transparent: true,
		});
	}

	private createGridlines() {
		const gridlines = new PIXI.Graphics();
		gridlines.lineStyle(2 / this.zoom, 0x000000, .1);
		for (let x = 1; x < this.props.width; x++) {
			gridlines.moveTo(x, 0);
			gridlines.lineTo(x, this.props.height);
		}
		for (let y = 1; y < this.props.height; y++) {
			gridlines.moveTo(0, y);
			gridlines.lineTo(this.props.width, y);
		}
		return gridlines;
	}

	private createBorder() {
		const border = new PIXI.Graphics();
		border.lineStyle(2 / this.zoom, 0x000000);
		border.lineAlignment = 0;
		border.drawRect(0, 0, this.props.width, this.props.height);
		return border;
	}

	public componentDidMount() {
		this.containerRef.current.appendChild(this.pixiApp.view);
		if (this.props.layers)
			this.props.layers.forEach(layer => {
				this.pixiApp.stage.addChild(layer.current.container);
			});
		this.pixiApp.stage.addChild(this.createGridlines());
		this.pixiApp.stage.addChild(this.createBorder());
		this.pixiApp.stage.scale = new PIXI.Point(this.zoom, this.zoom);
	}

	public render() {
		return <div
			ref={this.containerRef}
		/>;
	}
}
