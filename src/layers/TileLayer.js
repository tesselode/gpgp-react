import React from 'react';

const TileLayer = (props) => {
	let scale = props.tileset.imageWidth / props.tileset.tileSize;
	return <img
		src={props.tileset.image}
		style={{
			width: scale + 'em',
			imageRendering: 'pixelated',
		}}
	/>;
}

export default TileLayer;
