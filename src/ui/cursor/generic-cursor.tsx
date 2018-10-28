import React from 'react';
import { Rect } from '../../util';

export interface CursorProps {
	enabled: boolean;
	tileSize: number;
	cursor: Rect;
	removing?: boolean;
}

export default class GenericCursor extends React.Component<CursorProps> {
	public render() {
		return <div
			style={{
				position: 'absolute',
				left: this.props.cursor.l * this.props.tileSize + 1 + 'px',
				top: this.props.cursor.t * this.props.tileSize + 1 + 'px',
				width: this.props.tileSize * (this.props.cursor.r - this.props.cursor.l + 1) + 'px',
				height: this.props.tileSize * (this.props.cursor.b - this.props.cursor.t + 1) + 'px',
				opacity: this.props.enabled ? 1 : 0,
				background: this.props.removing ? 'rgba(255, 0, 0, .1)' : 'rgba(0, 0, 0, .1)',
				pointerEvents: 'none',
			}}
		/>;
	}
}
