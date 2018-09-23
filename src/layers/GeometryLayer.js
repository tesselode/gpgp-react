import React, { Component } from 'react';

class GeometryLayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [
				{x: 1, y: 4},
				{x: 2, y: 4},
				{x: 3, y: 5},
			],
		};
	}

	render() {
		return(
			<div>
				{this.state.data.map((tile, i) =>
					<div
						style={{
							position: 'absolute',
							left: tile.x + 'em',
							top: tile.y + 'em',
							width: '1em',
							height: '1em',
							background: '#27bbe8'
						}}
					/>
				)}
			</div>
		)
	}
}

export default GeometryLayer;
