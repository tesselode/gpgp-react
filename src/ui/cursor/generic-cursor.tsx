import React from 'react';

export interface CursorProps {
	enabled: boolean;
	tileSize: number;
	cursorX: number;
	cursorY: number;
}

export default (props: CursorProps) => <div style={{
	position: 'absolute',
	left: props.cursorX * props.tileSize + 1 + 'px',
	top: props.cursorY * props.tileSize + 1 + 'px',
	width: props.tileSize + 'px',
	height: props.tileSize + 'px',
	opacity: props.enabled ? 1 : 0,
	background: 'rgba(0, 0, 0, .1)',
	pointerEvents: 'none',
}}/>
