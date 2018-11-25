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
	/** Whether to show a box shadow under the level. */
	hasShadow?: boolean;
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
	private gridRef = React.createRef<HTMLDivElement>();

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
			const canvasRect = this.gridRef.current.getBoundingClientRect();
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

	public render() {
		const scale = this.props.tileSize * this.state.zoom;
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
					transform: 'translate(' + this.state.panX + 'px, ' + this.state.panY + 'px) ',
				}}
			>
				<div
					ref={this.gridRef}
					style={{
						width: 0,
						height: 0,
						transform: 'scale(' + this.state.zoom + ')',
						imageRendering: 'pixelated',
					}}
				>
					{this.props.children}
				</div>
				{!this.props.hideGrid && <div
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						width: this.props.width * scale,
						height: this.props.height * scale,
						backgroundImage: 'repeating-linear-gradient(0deg, transparent, ' +
							'transparent ' + (scale - 2) + 'px, ' +
							'rgba(200, 200, 200, .33) ' + (scale - 2) + 'px, ' +
							'rgba(200, 200, 200, .33) ' + scale + 'px), ' +
							'repeating-linear-gradient(90deg, transparent, ' +
							'transparent ' + (scale - 2) + 'px, ' +
							'rgba(200, 200, 200, .33) ' + (scale - 2) + 'px, ' +
							'rgba(200, 200, 200, .33) ' + scale + 'px)',
						backgroundPosition: '0 -2px',
					}}
				/>}
				<div
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						width: this.props.width * scale,
						height: this.props.height * scale,
						boxShadow: this.props.hasShadow && '8px 8px 32px 0 rgba(0, 0, 0, .25)',
						outline: '2px solid black',
					}}
				/>
			</div>
		</div>;
	}
}
