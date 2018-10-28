import React from 'react';
import { Rect } from '../util';
import { CursorProps } from './cursor/generic-cursor';

const gridRenderingScale = 2;

export enum GridTool {
	Pencil,
	Rectangle,
}

export interface Props {
	tool?: GridTool;
	tileSize: number;
	width: number;
	height: number;
	startingZoom?: number;
	cursor?: React.ComponentClass<CursorProps>;
	additionalCursorProps?: object;
	onPlace?: (rect: Rect) => void;
	onRemove?: (rect: Rect) => void;
	onMouseUp?: () => void;
}

export interface State {
	zoom: number;
	cursorL: number;
	cursorT: number;
	cursorR?: number;
	cursorB?: number;
	mouseDown: number | boolean;
}

export default class Grid extends React.Component<Props, State> {
	private canvasRef = React.createRef<HTMLCanvasElement>();

	constructor(props) {
		super(props);
		this.state = {
			zoom: this.props.startingZoom ? this.props.startingZoom : 2,
			cursorL: 0,
			cursorT: 0,
			mouseDown: false,
		};
	}

	private getNormalizedCursorRect(): Rect {
		const l = this.state.cursorL;
		const t = this.state.cursorT;
		let r = this.state.cursorR;
		let b = this.state.cursorB;
		if (r == null) r = l;
		if (b == null) b = t;
		const newL = Math.min(l, r);
		const newR = Math.max(l, r);
		const newT = Math.min(t, b);
		const newB = Math.max(t, b);
		return {l: newL, r: newR, t: newT, b: newB};
	}

	private onCursorMove(x, y) {
		switch (this.props.tool) {
			case GridTool.Rectangle:
				if (this.state.mouseDown === 0 || this.state.mouseDown === 2)
					this.setState({cursorR: x, cursorB: y});
				else
					this.setState({cursorL: x, cursorT: y});
				break;
			default:
				this.setState({cursorL: x, cursorT: y});
				switch (this.state.mouseDown) {
					case 0:
						if (this.props.onPlace) this.props.onPlace(this.getNormalizedCursorRect());
						break;
					case 2:
						if (this.props.onRemove) this.props.onRemove(this.getNormalizedCursorRect());
						break;
					default:
						break;
				}
				break;
		}
	}

	private onMouseMove(x, y) {
		const scale = this.props.tileSize * this.state.zoom;
		const relativeMouseX = x / scale;
		const relativeMouseY = y / scale;
		const gridL = Math.min(Math.floor(relativeMouseX), this.props.width - 1);
		const gridR = Math.min(Math.floor(relativeMouseY), this.props.height - 1);
		this.onCursorMove(gridL, gridR);
	}

	private onMouseDown(event) {
		this.setState({mouseDown: event.button});
		switch (this.props.tool) {
			case GridTool.Rectangle:
				break;
			default:
				switch (event.button) {
					case 0:
						if (this.props.onPlace)
							this.props.onPlace(this.getNormalizedCursorRect());
						break;
					case 2:
						if (this.props.onRemove)
							this.props.onRemove(this.getNormalizedCursorRect());
						break;
					default:
						break;
				}
				break;
		}
	}

	private onMouseUp() {
		switch (this.props.tool) {
			case GridTool.Rectangle:
				if (typeof(this.state.cursorR) === 'number' && typeof(this.state.cursorB) === 'number') {
					switch (this.state.mouseDown) {
						case 0:
							if (this.props.onPlace)
								this.props.onPlace(this.getNormalizedCursorRect());
							break;
						case 2:
							if (this.props.onRemove)
								this.props.onRemove(this.getNormalizedCursorRect());
							break;
						default:
							break;
					}
				}
				break;
			default:
				break;
		}
		if (this.props.onMouseUp) this.props.onMouseUp();
		this.setState({
			mouseDown: false,
			cursorR: null,
			cursorB: null,
		});
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
			{this.props.cursor && React.createElement(this.props.cursor, {
				...this.props.additionalCursorProps,
				enabled: true,
				tileSize: this.props.tileSize,
				cursor: this.getNormalizedCursorRect(),
				removing: this.state.mouseDown === 2,
			})}
		</div>;
	}
}
