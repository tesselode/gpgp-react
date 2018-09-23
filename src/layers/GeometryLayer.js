import React, { Component } from 'react';

class GeometryLayer extends Component {
	render() {
		return(
			<div>
				{this.props.data.map((tile, i) =>
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
