import React from 'react';

const GeometryLayer = (props) =>
	<div>
		{props.data.map((tile, i) =>
			<div
				style={{
					position: 'absolute',
					zIndex: props.order,
					left: tile.x + 'em',
					top: tile.y + 'em',
					width: '1em',
					height: '1em',
					background: 'rgba(39, 187, 232, .33)'
				}}
				key={i}
			/>
		)}
	</div>

export default GeometryLayer;
