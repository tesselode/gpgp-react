import React from 'react';

/** The resolution multiplier for rendering the grid lines. */
const gridRenderingScale = 2;

interface Props {
	/** The width and height of tiles (in pixels). */
	tileSize: number;
	/** The width of the grid (in tiles). */
	width: number;
	/** The height of the grid (in tiles). */
	height: number;
	/** The zoom multiplier when the grid is first displayed (defaults to 2.0). */
	startingZoom?: number;
	/** Whether to hide the grid. */
	hideGrid?: boolean;
	/** A function that is called when the cursor is moved. */
	onMove?: (x: number, y: number) => void;
	/** A function that is called when the grid is clicked. */
	onClick?: (button: number) => void;
	/** A function that is called when a mouse button is released. */
	onRelease?: (button: number) => void;
	/** A function that is called when the grid is double-clicekd. */
	onDoubleClick?: (button: number) => void;
}

interface State {
	/** The current zoom level of the grid. */
	zoom: number;
	/** The previous x position of the mouse. */
	previousMouseX: number;
	/** The previous y position of the mouse. */
	previousMouseY: number;
	/** The current horizontal panning of the grid (in pixels). */
	panX: number;
	/** The current vertical panning of the grid (in pixels). */
	panY: number;
	/** The current x position of the cursor (in tiles). */
	cursorX: number;
	/** The current y position of the cursor (in tiles). */
	cursorY: number;
	/** The currently pressed mouse button. (0 = left, 2 = right) */
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
			previousMouseX: 0,
			previousMouseY: 0,
			panX: 0,
			panY: 0,
			cursorX: 0,
			cursorY: 0,
			button: false,
		};
	}

	private onMouseMove(x, y) {
		if (this.state.button === 1) {
			this.setState({
				panX: this.state.panX + (x - this.state.previousMouseX),
				panY: this.state.panY + (y - this.state.previousMouseY),
			});
		} else {
			const canvasRect = this.canvasRef.current.getBoundingClientRect();
			const scale = this.props.tileSize * this.state.zoom;
			const relativeMouseX = (x - canvasRect.left) / scale;
			const relativeMouseY = (y - canvasRect.top) / scale;
			const cursorX = Math.floor(relativeMouseX);
			const cursorY = Math.floor(relativeMouseY);
			if (cursorX !== this.state.cursorX || cursorY !== this.state.cursorY) {
				if (this.props.onMove) this.props.onMove(cursorX, cursorY);
				this.setState({cursorX, cursorY});
			}
		}
		this.setState({previousMouseX: x, previousMouseY: y});
	}

	private onMouseDown(event: React.MouseEvent<HTMLDivElement>) {
		event.preventDefault();
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

	private onWheel(event: React.WheelEvent<HTMLDivElement>) {
		if (!event.ctrlKey) return;
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
		if (this.props.hideGrid) return;
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
				width: '100%',
				height: '100%',
			}}
			onMouseDown={this.onMouseDown.bind(this)}
			onMouseUp={this.onMouseUp.bind(this)}
			onWheel={this.onWheel.bind(this)}
			onMouseMove={(event) => {this.onMouseMove(event.clientX, event.clientY); }}
			onDoubleClick={(event) => {this.props.onDoubleClick(event.button); }}
		>
			<div
				style={{
					width: 0,
					height: 0,
					transform: 'translate(' + this.state.panX + 'px, ' + this.state.panY + 'px) ' +
						'scale(' + this.state.zoom + ')',
					imageRendering: 'pixelated',
				}}
			>
				<canvas
					ref={this.canvasRef}
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						border: '1px solid black',
						transform: 'scale(' + (1 / gridRenderingScale) + ')',
						transformOrigin: '0% 0%',
					}}
				/>
				{this.props.children}
			</div>
		</div>;
	}
}
