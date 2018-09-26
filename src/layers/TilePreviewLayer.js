import React from 'react';

const TilePreviewLayer = (props) => {
	let scale = props.tileset.imageWidth / props.tileset.tileSize;
	return <div>
		<img
			src={props.tileset.image}
			alt=''
			style={{
				position: 'absolute',
				zIndex: props.order,
				width: scale + 'em',
				imageRendering: 'pixelated',
			}}
		/>
		<div
			style={{
				position: 'absolute',
				zIndex: props.order + 1,
				width: '1em',
				height: '1em',
				left: props.selectedTileX + 'em',
				top: props.selectedTileY + 'em',
				border: '1px solid red',
			}}
		/>
	</div>;
}

export default TilePreviewLayer;
