import React, { Component } from 'react';
import GridSquare from './GridSquare';
import GeometryLayer from '../layers/GeometryLayer';
import TilePreviewLayer from '../layers/TilePreviewLayer';
import TileLayer from '../layers/TileLayer';

class Editor extends Component {
	constructor(props) {
		super(props);

		this.state = {
			zoom: 2 * (props.startingZoom ? props.startingZoom : 1),
			cursorX: 0,
			cursorY: 0,
			mouseDown: false,
		};
	}

	renderCanvas() {
		const canvas = this.refs.canvas;
		canvas.width = this.props.mapWidth * 16 * this.state.zoom;
		canvas.height = this.props.mapHeight * 16 * this.state.zoom;
		const context = canvas.getContext('2d');
		context.strokeStyle = '#bbb';
		for (let x = 1; x < this.props.mapWidth; x++) {
			context.moveTo(x * 16 * this.state.zoom, 0);
			context.lineTo(x * 16 * this.state.zoom, this.props.mapHeight * 16 * this.state.zoom);
			context.stroke();
		}
		for (let y = 1; y < this.props.mapHeight; y++) {
			context.moveTo(0, y * 16 * this.state.zoom);
			context.lineTo(this.props.mapWidth * 16 * this.state.zoom, y * 16 * this.state.zoom);
			context.stroke();
		}
	}

	componentDidMount() {
		this.renderCanvas();
	}

	componentDidUpdate() {
		this.renderCanvas();
	}

	onMouseDown(event) {
		this.setState({mouseDown: event.button});
		switch (event.button) {
			case 0:
				this.props.onPlace(this.state.cursorX, this.state.cursorY);
				break;
			case 2:
				this.props.onRemove(this.state.cursorX, this.state.cursorY);
				break;
			default:
				break;
		}
	}

	onMouseUp(event) {
		this.setState({mouseDown: false});
		this.props.onMouseUp();
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

	onGridSquareHovered(x, y) {
		this.setState({
			cursorX: x,
			cursorY: y,
		});
		switch (this.state.mouseDown) {
			case 0:
				this.props.onPlace(x, y);
				break;
			case 2:
				this.props.onRemove(x, y);
				break;
			default:
				break;
		}
	}

	render() {
		return <div>
			<canvas
				ref='canvas'
				width={this.props.mapWidth * 16 * this.state.zoom}
				height={this.props.mapHeight * 16 * this.state.zoom}
				onWheel={(event) => this.onWheel(event)}
				style={{
					border: '1px solid black',
				}}
			/>
		</div>;
	}
}

export default Editor;
