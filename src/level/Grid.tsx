import React from 'react';

const gridRenderingScale = 2;

export interface Props {
	tileSize: number;
	width: number;
	height: number;
	startingZoom?: number;
	hideCursor?: boolean;
	onPlace?: (x: number, y: number) => void,
	onRemove?: (x: number, y: number) => void,
	onMouseUp?: () => void,
}

export interface State {
	zoom: number;
	cursorX: number;
	cursorY: number;
	cursorOverGrid: boolean;
	mouseDown: number | boolean;
}

export default class Grid extends React.Component<Props, State> {
	canvasRef = React.createRef<HTMLCanvasElement>();

	constructor(props) {
		super(props);
		this.state = {
			zoom: this.props.startingZoom ? this.props.startingZoom : 2,
			cursorX: 0,
			cursorY: 0,
			cursorOverGrid: false,
			mouseDown: false,
		}
	}

	onCursorMove(x, y) {
		this.setState({cursorX: x, cursorY: y});
		if (!this.state.cursorOverGrid) return;
		switch (this.state.mouseDown) {
			case 0:
				if (this.props.onPlace) this.props.onPlace(x, y);
				break;
			case 2:
				if (this.props.onRemove) this.props.onRemove(x, y);
				break;
			default:
				break;
		}
	}

	onMouseMove(x, y) {
		let scale = this.props.tileSize * this.state.zoom;
		let relativeMouseX = x / scale;
		let relativeMouseY = y / scale;
		let cursorX = Math.min(Math.floor(relativeMouseX), this.props.width - 1);
		let cursorY = Math.min(Math.floor(relativeMouseY), this.props.height - 1);
		if (cursorX !== this.state.cursorX || cursorY !== this.state.cursorY)
			this.onCursorMove(cursorX, cursorY);
	}

	onMouseDown(event) {
		this.setState({mouseDown: event.button});
		if (!this.state.cursorOverGrid) return;
		switch (event.button) {
			case 0:
				if (this.props.onPlace)
					this.props.onPlace(this.state.cursorX, this.state.cursorY);
				break;
			case 2:
				if (this.props.onRemove)
					this.props.onRemove(this.state.cursorX, this.state.cursorY);
				break;
			default:
				break;
		}
	}

	onMouseUp() {
		if (this.props.onMouseUp) this.props.onMouseUp();
		this.setState({mouseDown: false});
	}

	onWheel(event) {
		event.preventDefault();
		if (event.deltaY > 0) {
			this.setState({zoom: this.state.zoom / 1.1});
		}
		if (event.deltaY < 0) {
			this.setState({zoom: this.state.zoom * 1.1});
		}
	}

	renderCanvas() {
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

	componentDidMount() {
		this.renderCanvas();
	}

	componentDidUpdate() {
		this.renderCanvas();
	}

	render() {
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
					let rect = this.canvasRef.current.getBoundingClientRect();
					this.onMouseMove(event.clientX - rect.left, event.clientY - rect.top);
				}}
				onMouseEnter={() => this.setState({cursorOverGrid: true})}
				onMouseLeave={() => this.setState({cursorOverGrid: false})}
			/>
			{this.props.children}
			{!this.props.hideCursor && <div style={{
				opacity: this.state.cursorOverGrid ? 1 : 0,
				position: 'absolute',
				left: this.state.cursorX * this.props.tileSize + 1 + 'px',
				top: this.state.cursorY * this.props.tileSize + 1 + 'px',
				width: this.props.tileSize + 'px',
				height: this.props.tileSize + 'px',
				background: 'rgba(0, 0, 0, .1)',
				pointerEvents: 'none',
			}}/>}
		</div>;
	}
}
