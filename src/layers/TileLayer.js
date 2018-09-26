import React from 'react';

const TileLayer = (props) => {
	let scale = props.tileset.imageWidth / props.tileset.tileSize;
	return <div>
		{props.data.map((tile, i) =>
			<div
				style={{
					position: 'absolute',
					zIndex: props.order,
					left: tile.x + 'em',
					top: tile.y + 'em',
					width: '1em',
					height: '1em',
					overflow: 'hidden',
				}}
				key={i}
			>
				<img
					src={props.tileset.image}
					alt=''
					style={{
						position: 'absolute',
						zIndex: props.order,
						left: -tile.tileX + 'em',
						top: -tile.tileY + 'em',
						width: scale + 'em',
						imageRendering: 'pixelated',
					}}
				/>
			</div>
		)}
	</div>;
}

export default TileLayer
