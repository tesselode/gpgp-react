import React, { Component } from 'react';
import GridSquare from './GridSquare';
import GeometryLayer from '../layers/GeometryLayer';

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
		}
		
	}

	onMouseUp(event) {
		this.setState({mouseDown: false});
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
			<div>
				<div
					style={{
						position: 'relative',
						width: this.props.level.width + 'em',
						height: this.props.level.height + 'em',
						fontSize: this.state.zoom + 'em',
					}}
					onMouseDown={(event) => this.onMouseDown(event)}
					onMouseUp={(event) => this.onMouseUp(event)}
					onContextMenu={(event) => event.preventDefault()}
					onDragStart={(event) => event.preventDefault()}
				>
					{this.props.level.layers.map((layer, i) =>
						<GeometryLayer data={layer.data} key={i} />
					)}
					{gridSquares}
				</div>
			</div>
		);
	}
}

export default Editor;
