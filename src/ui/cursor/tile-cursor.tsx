import React from 'react';
import { CursorProps } from './generic-cursor';
import { TilesetImage } from '../../data/project-resources';

export interface TileCursorProps {
	tilesetImage: TilesetImage;
	tileX: number;
	tileY: number;
}

export default (tileCursorProps: TileCursorProps) =>
	(props: CursorProps) => <div
		style={{
			position: 'absolute',
			left: props.cursorL * props.tileSize + 1 + 'px',
			top: props.cursorT * props.tileSize + 1 + 'px',
			width: props.tileSize + 'px',
			height: props.tileSize + 'px',
			opacity: props.enabled ? .67 : 0,
			pointerEvents: 'none',
			overflow: 'hidden',
		}}
	>
		<img
			src={tileCursorProps.tilesetImage && tileCursorProps.tilesetImage.data}
			alt=''
			style={{
				position: 'absolute',
				left: -tileCursorProps.tileX * props.tileSize - 1 + 'px',
				top: -tileCursorProps.tileY * props.tileSize - 1 + 'px',
				pointerEvents: 'none',
				imageRendering: 'pixelated',
			}}
		/>
	</div>
