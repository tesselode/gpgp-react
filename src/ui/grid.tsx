import React from 'react';
import { Rect } from '../util';

/** The resolution multiplier for rendering the grid lines. */
const gridRenderingScale = 2;

interface Props {
	/** The width and height of tiles (in pixels). */
	tileSize: number;
	/** The width of the grid (in tiles). */
	width: number;
	/** The height of the grid (in tiles). */
	height: number;
	/** The background color of the grid. */
	background?: string;
	/** The zoom multiplier when the grid is first displayed (defaults to 2.0). */
	startingZoom?: number;
	/** A function that is called when the cursor is moved. */
	onMove?: (x: number, y: number) => void;
	/** A function that is called when the grid is clicked. */
	onClick?: (button: number) => void;
	/** A function that is called when a mouse button is released. */
	onRelease?: (button: number) => void;
}

interface State {
	/** The current zoom level of the grid. */
	zoom: number;
	/** The current x position of the cursor. */
	cursorX: number;
	/** The current y position of the cursor. */
	cursorY: number;
	/** The currently pressed mouse button. */
	button: number | false;
}

/** An interactive grid that can be used for placing and removing tiles,
 * selecting regions, or just displaying an image.
 * Elements can be drawn on the grid by passing them as children.
 */
export default class Grid extends React.Component<Props, State> {
	private canvasRef = React.createRef<HTMLCanvasElement>();

	constructor(props) {
		super(props);
		this.state = {
			zoom: this.props.startingZoom ? this.props.startingZoom : 2,
			cursorX: 0,
			cursorY: 0,
			button: false,
		};
	}

	private onMouseMove(x, y) {
		const scale = this.props.tileSize * this.state.zoom;
		const relativeMouseX = x / scale;
		const relativeMouseY = y / scale;
		const cursorX = Math.min(Math.floor(relativeMouseX), this.props.width - 1);
		const cursorY = Math.min(Math.floor(relativeMouseY), this.props.height - 1);
		if (cursorX !== this.state.cursorX || cursorY !== this.state.cursorY) {
			if (this.props.onMove) this.props.onMove(cursorX, cursorY);
			this.setState({cursorX, cursorY});
		}
	}

	private onMouseDown(event) {
		if (this.state.button === false) {
			this.setState({button: event.button});
			if (this.props.onClick) this.props.onClick(event.button);
		}
	}

	private onMouseUp(event) {
		if (event.button === this.state.button) {
			this.setState({button: false});
			if (this.props.onRelease) this.props.onRelease(event.button);
		}
	}

	private onWheel(event) {
		event.preventDefault();
		if (event.deltaY > 0) {
			this.setState({zoom: this.state.zoom / 1.1});
		}
		if (event.deltaY < 0) {
			this.setState({zoom: this.state.zoom * 1.1});
		}
	}

	/** Renders the lines of the grid. */
	private renderCanvas() {
		const canvas = this.canvasRef.current;
		canvas.width = this.props.width * this.props.tileSize * gridRenderingScale;
		canvas.height = this.props.height * this.props.tileSize * gridRenderingScale;
		const context = canvas.getContext('2d');
		context.strokeStyle = '#bbb';
		for (let x = 1; x < this.props.width; x++) {
			context.moveTo(x * this.props.tileSize * gridRenderingScale, 0);
			context.lineTo(x * this.props.tileSize * gridRenderingScale,
				this.props.height * this.props.tileSize * gridRenderingScale);
			context.stroke();
		}
		for (let y = 1; y < this.props.height; y++) {
			context.moveTo(0, y * this.props.tileSize * gridRenderingScale);
			context.lineTo(this.props.width * this.props.tileSize * gridRenderingScale,
				y * this.props.tileSize * gridRenderingScale);
			context.stroke();
		}
	}

	public componentDidMount() {
		this.renderCanvas();
	}

	public componentDidUpdate() {
		this.renderCanvas();
	}

	public render() {
		return <div
			style={{
				width: 0,
				height: 0,
				transformOrigin: '0% 0%',
				transform: 'scale(' + this.state.zoom + ')',
				imageRendering: 'pixelated',
				transition: '.15s',
			}}
			onMouseDown={this.onMouseDown.bind(this)}
			onMouseUp={this.onMouseUp.bind(this)}
			onWheel={this.onWheel.bind(this)}
		>
			<canvas
				ref={this.canvasRef}
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					background: this.props.background,
					border: '1px solid black',
					transform: 'scale(' + (1 / gridRenderingScale) + ')',
					transformOrigin: '0% 0%',
				}}
				onMouseMove={(event) => {
					const rect = this.canvasRef.current.getBoundingClientRect();
					this.onMouseMove(event.clientX - rect.left, event.clientY - rect.top);
				}}
			/>
			{this.props.children}
		</div>;
	}
}
