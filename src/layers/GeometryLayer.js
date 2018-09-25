import React from 'react';

const GeometryLayer = (props) =>
	<div>
		{props.data.map((tile, i) =>
			<div
				style={{
					position: 'absolute',
					left: tile.x + 'em',
					top: tile.y + 'em',
					width: '1em',
					height: '1em',
					background: '#27bbe8'
				}}
				key={i}
			/>
		)}
	</div>

export default GeometryLayer;
