import React, { Component } from 'react';
import GridSquare from './GridSquare';

class Grid extends Component {
	constructor(props) {
		super(props);

		this.state = {
			cursorX: 0,
			cursorY: 0,
			cursorWithinMap: false,
			zoom: 2,
		};
	}

	onGridSquareHovered(x, y) {
		this.setState({
			cursorX: x,
			cursorY: y,
		});
	}

	render() {
		let gridSquares = [];
		let i = -1;
		for (let x = 0; x < this.props.width; x++) {
			for (let y = 0; y < this.props.height; y++) {
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
					onMouseEnter={() => this.setState({cursorWithinMap: true})}
					onMouseLeave={() => this.setState({cursorWithinMap: false})}
					style={{
						position: 'relative',
						width: this.props.width + 'em',
						height: this.props.height + 'em',
						fontSize: this.state.zoom + 'em',
					}}
				>
					{this.props.layers}
					{gridSquares}
				</div>
				Cursor X: {this.state.cursorX}
				<br />
				Cursor Y: {this.state.cursorY}
				<br />
				Is cursor within map? {this.state.cursorWithinMap ? 'Yes' : 'No'}
			</div>
		);
	}
}

export default Grid;
