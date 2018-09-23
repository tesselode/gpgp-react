import React, { Component } from 'react';
import GridSquare from './GridSquare';

class Grid extends Component {
	constructor(props) {
		super(props);

		this.state = {
			width: 16,
			height: 9,
		};
	}

	render() {
		let gridSquares = [];
		let i = -1;
		for (let x = 0; x < this.state.width; x++) {
			for (let y = 0; y < this.state.height; y++) {
				i += 1;
				gridSquares.push(<GridSquare x={x} y={y} key={i} />)				
			}
		}

		return(
			<div>
				{gridSquares}
			</div>
		);
	}
}

export default Grid;
