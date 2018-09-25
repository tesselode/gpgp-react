import React, { Component } from 'react';
import GridSquare from './GridSquare';
import GeometryLayer from '../layers/GeometryLayer';
import TileLayer from '../layers/TileLayer';

class Editor extends Component {
	constructor(props) {
		super(props);

		this.state = {
			zoom: 2,
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
		let gridSquares = [];
		let i = -1;
		for (let x = 0; x < this.props.level.width; x++) {
			for (let y = 0; y < this.props.level.height; y++) {
				i += 1;
				gridSquares.push(<GridSquare
					key={i}
					x={x}
					y={y}
					onHover={() => this.onGridSquareHovered(x, y)}
				/>);
			}
		}

		return(
			<div
				style={{
					width: '67vw',
					height: '90vh',
					overflow: 'auto',
				}}
				onWheel={(event) => this.onWheel(event)}
				onContextMenu={(event) => event.preventDefault()}
				onDragStart={(event) => event.preventDefault()}
			>
				<div
					style={{
						position: 'relative',
						width: this.props.level.width + 'em',
						height: this.props.level.height + 'em',
						fontSize: this.state.zoom + 'em',
						transition: '.15s',
					}}
					onMouseDown={(event) => this.onMouseDown(event)}
					onMouseUp={(event) => this.onMouseUp(event)}
				>
					{this.props.level.layers.map((layer, i) => {
						switch (layer.type) {
							case 'geometry':
								return <GeometryLayer data={layer.data} key={i} />;
							case 'tile':
								let tileset = this.props.project.tilesets[layer.tileset];
								return <TileLayer tileset={tileset} key={i} />;
							default:
								return '';
						}
					})}
					{gridSquares}
				</div>
			</div>
		);
	}
}

export default Editor;
