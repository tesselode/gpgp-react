import React from 'react';

const TilePreviewLayer = (props) => {
	let scale = props.tileset.imageWidth / props.tileset.tileSize;
	return <div>
		<img
			src={props.tileset.image}
			alt=''
			style={{
				position: 'absolute',
				width: scale + 'em',
				imageRendering: 'pixelated',
				pointerEvents: 'none',
			}}
		/>
		<div
			style={{
				position: 'absolute',
				zIndex: 2,
				width: '1em',
				height: '1em',
				left: props.selectedTileX + 'em',
				top: props.selectedTileY + 'em',
				border: '1px solid red',
				pointerEvents: 'none',
			}}
		/>
	</div>;
}

export default TilePreviewLayer;
