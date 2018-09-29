import React, { Component } from 'react';
import Grid from './Grid';
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
				/>
			</div>
		</div>;
	}
}

export default Editor;
