import React from 'react';

const TilePreviewLayer = (props) => {
	return <div>
		<img
			src={props.tileset.image}
			alt=''
			style={{
				position: 'absolute',
			}}
		/>
		<div
			style={{
				position: 'absolute',
				zIndex: 2,
				width: props.tileSize + 1 + 'px',
				height: props.tileSize + 1 + 'px',
				left: props.selectedTileX * props.tileSize + 'px',
				top: props.selectedTileY * props.tileSize + 'px',
				border: '1px solid red',
				pointerEvents: 'none',
			}}
		/>
	</div>
}

export default TilePreviewLayer;
