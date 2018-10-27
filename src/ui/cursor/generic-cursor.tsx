import React from 'react';

export interface CursorProps {
	enabled: boolean;
	tileSize: number;
	cursorL: number;
	cursorT: number;
	cursorR?: number;
	cursorB?: number;
	removing?: boolean;
}

export default (props: CursorProps) => <div style={{
	position: 'absolute',
	left: props.cursorL * props.tileSize + 1 + 'px',
	top: props.cursorT * props.tileSize + 1 + 'px',
	width: props.tileSize * (props.cursorR - props.cursorL + 1) + 'px',
	height: props.tileSize * (props.cursorB - props.cursorT + 1) + 'px',
	opacity: props.enabled ? 1 : 0,
	background: props.removing ? 'rgba(1, 0, 0, .1)' : 'rgba(0, 0, 0, .1)',
	pointerEvents: 'none',
}} />
