import * as PIXI from 'pixi.js';
import React from 'react';

export interface GridContent {
	container: PIXI.Container;
}

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
	content?: GridContent[];
}

interface State {
	/** The current x position of the cursor (in tiles). */
	cursorX: number;
	/** The current y position of the cursor (in tiles). */
	cursorY: number;
}

/** An interactive grid that can display content. */
export default class Grid extends React.Component<Props, State> {
	private pixiApp: PIXI.Application;
	private containerRef = React.createRef<HTMLDivElement>();
	private zoom = 16;

	constructor(props: Props) {
		super(props);
		this.state = {
			cursorX: 0,
			cursorY: 0,
		};
		this.pixiApp = new PIXI.Application({
			width: props.viewportWidth,
			height: props.viewportHeight,
			transparent: true,
		});
		this.onMouseMove = this.onMouseMove.bind(this);
	}

	private onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
		const rect = this.containerRef.current.getBoundingClientRect();
		let mouseX = event.clientX - rect.left;
		let mouseY = event.clientY - rect.top;
		mouseX /= this.zoom;
		mouseY /= this.zoom;
		this.setState({
			cursorX: Math.floor(mouseX),
			cursorY: Math.floor(mouseY),
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
		if (this.props.content)
			this.props.content.forEach(layer => {
				this.pixiApp.stage.addChild(layer.container);
			});
		this.pixiApp.stage.addChild(this.createGridlines());
		this.pixiApp.stage.addChild(this.createBorder());
		this.pixiApp.stage.scale = new PIXI.Point(this.zoom, this.zoom);
	}

	public render() {
		return <div>
			<div
				ref={this.containerRef}
				style={{
					width: this.props.viewportWidth,
					height: this.props.viewportHeight,
				}}
				onMouseMove={this.onMouseMove}
			/>
			<div>
				{this.state.cursorX}
				<br />
				{this.state.cursorY}
			</div>
		</div>;
	}
}
