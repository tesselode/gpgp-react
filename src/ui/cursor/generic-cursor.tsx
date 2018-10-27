import React from 'react';
import { Rect } from '../../util';

export interface CursorProps {
	enabled: boolean;
	tileSize: number;
	rect: Rect;
	removing?: boolean;
}

export default (props: CursorProps) => <div style={{
	position: 'absolute',
	left: props.rect.l * props.tileSize + 1 + 'px',
	top: props.rect.t * props.tileSize + 1 + 'px',
	width: props.tileSize * (props.rect.r - props.rect.l + 1) + 'px',
	height: props.tileSize * (props.rect.b - props.rect.t + 1) + 'px',
	opacity: props.enabled ? 1 : 0,
	background: props.removing ? 'rgba(1, 0, 0, .1)' : 'rgba(0, 0, 0, .1)',
	pointerEvents: 'none',
}} />
