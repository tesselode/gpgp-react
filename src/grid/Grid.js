import React, { Component } from 'react';
import GridSquare from './GridSquare';

class Grid extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let gridSquares = [];
		let i = -1;
		for (let x = 0; x < this.props.width; x++) {
			for (let y = 0; y < this.props.height; y++) {
				i += 1;
				gridSquares.push(<GridSquare x={x} y={y} key={i} />)				
			}
		}

		return(
			<div
				style={{
					fontSize: '2em',
				}}
			>
				{gridSquares}
			</div>
		);
	}
}

export default Grid;
