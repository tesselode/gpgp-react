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
	/** A function to call when the grid is clicked. */
	onClick?: (cursorX: number, cursorY: number) => void;
}

/** An interactive grid that can display content. */
export default class Grid extends React.Component<Props> {
	private pixiApp: PIXI.Application;
	private contentContainer = new PIXI.Container();
	private containerRef = React.createRef<HTMLDivElement>();
	private zoom = 32;
	private panX = 0;
	private panY = 0;
	private middleMouseButtonDown = false;
	private cursorX = 0;
	private cursorY = 0;

	constructor(props: Props) {
		super(props);
		this.pixiApp = new PIXI.Application({
			width: props.viewportWidth,
			height: props.viewportHeight,
			transparent: true,
		});
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
	}

	private onMouseDown(event: React.MouseEvent<HTMLDivElement>) {
		switch (event.button) {
			case 1:
				event.preventDefault();
				this.middleMouseButtonDown = true;
				break;
		}
		if (this.props.onClick)
			this.props.onClick(this.cursorX, this.cursorY);
	}

	private onMouseUp(event: React.MouseEvent<HTMLDivElement>) {
		switch (event.button) {
			case 1:
				event.preventDefault();
				this.middleMouseButtonDown = false;
				break;
		}
	}

	private onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
		if (this.middleMouseButtonDown) {
			this.panX += event.movementX;
			this.panY += event.movementY;
			this.pixiApp.stage.position.x = this.panX;
			this.pixiApp.stage.position.y = this.panY;
		}
		const rect = this.containerRef.current.getBoundingClientRect();
		let mouseX = event.clientX - rect.left;
		let mouseY = event.clientY - rect.top;
		mouseX -= this.panX;
		mouseY -= this.panY;
		mouseX /= this.zoom;
		mouseY /= this.zoom;
		this.cursorX = Math.floor(mouseX);
		this.cursorY = Math.floor(mouseY);
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
		this.pixiApp.stage.addChild(this.contentContainer);
		if (this.props.content)
			this.props.content.forEach(layer => {
				this.contentContainer.addChild(layer.container);
			});
		this.pixiApp.stage.addChild(this.createGridlines());
		this.pixiApp.stage.addChild(this.createBorder());
		this.pixiApp.stage.scale = new PIXI.Point(this.zoom, this.zoom);
	}

	public componentDidUpdate() {
		this.contentContainer.removeChildren(0, this.contentContainer.children.length);
		if (this.props.content)
			this.props.content.forEach(layer => {
				this.contentContainer.addChild(layer.container);
			});
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
				onMouseDown={this.onMouseDown}
				onMouseUp={this.onMouseUp}
			/>
		</div>;
	}
}
