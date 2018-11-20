import React from 'react';
import { Rect } from '../../../util';

interface Props {
	/** The tile size of the grid. */
	tileSize: number;
	/** The rectangular region of the cursor. */
	cursor: Rect;
	/** Whether the user is removing tiles. If so, the cursor will be red instead of blue. */
	removing?: boolean;
}

/** A visual representation of a rectangular cursor on a grid. */
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
