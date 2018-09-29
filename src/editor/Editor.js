import React, { Component } from 'react';
import Grid from './Grid';
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
			cursorOverGrid: false,
			mouseDown: false,
		};
	}

	onMouseMove(x, y) {
		let scale = this.state.zoom * this.props.project.tileSize
		let relativeMouseX = x / scale;
		let relativeMouseY = y / scale;
		let cursorX = Math.min(Math.floor(relativeMouseX), this.props.mapWidth - 1);
		let cursorY = Math.min(Math.floor(relativeMouseY), this.props.mapHeight - 1);
		this.setState({
			cursorX: cursorX,
			cursorY: cursorY,
		});
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
		return <div
			onWheel={(event) => this.onWheel(event)}
			style={{
				width: '100%',
				height: '100%',
			}}
		>
			<div
				style={{
					transformOrigin: '0% 0%',
					transform: 'scale(' + this.state.zoom + ')',
					imageRendering: 'pixelated',
					transition: '.15s',
				}}
			>
				<Grid
					mapWidth={this.props.mapWidth}
					mapHeight={this.props.mapHeight}
					tileSize={this.props.project.tileSize}
					onMouseMove={(x, y) => this.onMouseMove(x, y)}
					onMouseEnter={(event) => this.setState({cursorOverGrid: true})}
					onMouseLeave={(event) => this.setState({cursorOverGrid: false})}
				/>
				<div style={{
					opacity: this.state.cursorOverGrid ? 1 : 0,
					position: 'absolute',
					left: this.state.cursorX * this.props.project.tileSize + 1 + 'px',
					top: this.state.cursorY * this.props.project.tileSize + 1 + 'px',
					width: this.props.project.tileSize + 'px',
					height: this.props.project.tileSize + 'px',
					background: 'rgba(0, 0, 0, .1)',
					pointerEvents: 'none',
				}}/>
			</div>
		</div>;
	}
}

export default Editor;
