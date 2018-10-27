import React from 'react';
import { Rect } from '../../util';

export interface CursorProps {
	enabled: boolean;
	tileSize: number;
	cursor: Rect;
	removing?: boolean;
}

export default (props: CursorProps) =>
	<div
		style={{
			position: 'absolute',
			left: props.cursor.l * props.tileSize + 1 + 'px',
			top: props.cursor.t * props.tileSize + 1 + 'px',
			width: props.tileSize * (props.cursor.r - props.cursor.l + 1) + 'px',
			height: props.tileSize * (props.cursor.b - props.cursor.t + 1) + 'px',
			opacity: props.enabled ? 1 : 0,
			background: props.removing ? 'rgba(1, 0, 0, .1)' : 'rgba(0, 0, 0, .1)',
			pointerEvents: 'none',
		}}
	/>;
