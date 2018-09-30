import React, { Component } from 'react';
import Grid from './Grid';
import GeometryLayer from '../layers/GeometryLayer';
import TilePreviewLayer from '../layers/TilePreviewLayer';
import TileLayer from '../layers/TileLayer';

export const GridModes = Object.freeze({
	'OnTop': 0,
	'OnBottom': 1,
	'Hide': 2,
});

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

	onCursorMove(x, y) {
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

	onMouseMove(x, y) {
		let scale = this.state.zoom * this.props.project.tileSize
		let relativeMouseX = x / scale;
		let relativeMouseY = y / scale;
		let cursorX = Math.min(Math.floor(relativeMouseX), this.props.mapWidth - 1);
		let cursorY = Math.min(Math.floor(relativeMouseY), this.props.mapHeight - 1);
		if (cursorX !== this.state.cursorX || cursorY !== this.state.cursorY)
			this.onCursorMove(cursorX, cursorY);
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

	render() {
		return <div
			onWheel={(event) => this.onWheel(event)}
			style={{
				width: '100%',
				height: '100%',
			}}
			onMouseDown={(event) => this.onMouseDown(event)}
			onMouseUp={(event) => this.onMouseUp(event)}
		>
			<div
				style={{
					transformOrigin: '0% 0%',
					transform: 'scale(' + this.state.zoom + ')',
					imageRendering: 'pixelated',
					transition: '.15s',
				}}
			>
				{this.props.layers.map((layer, i) => {
					let order = i === this.props.selectedLayerIndex ? this.props.layers.length :
						this.props.layers.length - i;
					switch (layer.type) {
						case 'geometry':
							return <GeometryLayer
								data={layer.data}
								mapWidth={this.props.mapWidth}
								mapHeight={this.props.mapHeight}
								tileSize={this.props.project.tileSize}
								order={order}
								key={i}
							/>;
						case 'tile':
							return <TileLayer
								data={layer.data}
								mapWidth={this.props.mapWidth}
								mapHeight={this.props.mapHeight}
								tileSize={this.props.project.tileSize}
								tileset={this.props.project.tilesets[layer.tilesetName]}
								order={order}
								key={i}
							/>;
						case 'tilePreview':
							return <TilePreviewLayer
								tileset={layer.tileset}
								selectedTileX={layer.selectedTileX}
								selectedTileY={layer.selectedTileY}
								order={order}
								key={i}
							/>;
						default:
							return '';
					}
				})}
				<Grid
					visible={this.props.gridMode !== GridModes.Hide}
					order={this.props.gridMode === GridModes.OnTop ? this.props.layers.length : 0}
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
