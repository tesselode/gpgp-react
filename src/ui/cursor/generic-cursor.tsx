import React from 'react';
import { Rect } from '../../util';

interface Props {
	tileSize: number;
	cursor: Rect;
	removing?: boolean;
}

const GenericCursor = (props: Props) => <div
	style={{
		position: 'absolute',
		left: props.cursor.l * props.tileSize + 1 + 'px',
		top: props.cursor.t * props.tileSize + 1 + 'px',
		width: props.tileSize * (props.cursor.r - props.cursor.l + 1) + 'px',
		height: props.tileSize * (props.cursor.b - props.cursor.t + 1) + 'px',
		background: props.removing ? 'rgba(255, 0, 0, .1)' : 'rgba(0, 0, 0, .1)',
		pointerEvents: 'none',
	}}
/>;

export default GenericCursor;
