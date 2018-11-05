import React from 'react';

/** A circle filled in with a color. */
const ColorDisplay = (color: string) => <div
	style={{
		display: 'inline-block',
		position: 'relative',
		top: '.1em',
		width: '1em',
		height: '1em',
		borderRadius: '1em',
		background: color,
	}}
/>;

export default ColorDisplay;
