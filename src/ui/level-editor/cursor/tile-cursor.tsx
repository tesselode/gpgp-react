import React from 'react';
import { isNullOrUndefined } from 'util';
import Image from '../../../data/image';
import Rect from '../../../data/rect';
import Stamp from '../../../data/stamp';
import { EditTool } from '../edit-tool';
import GenericCursor from './generic-cursor';

interface Props {
	/** The tile size of the grid. */
	tileSize: number;
	/** The rectangular region of the cursor. */
	cursor: Rect;
	/** Whether the user is removing tiles. */
	removing?: boolean;
	/** The currently used editing tool. */
	tool: EditTool;
	/** The image for the currently used tileset. */
	tilesetImage: Image;
	/** The current tile stamp. */
	stamp?: Stamp;
}

/** A preview of what a tile layer placement will do. */
export default class TileCursor extends React.Component<Props> {
	private canvasRef = React.createRef<HTMLCanvasElement>();

	private renderCanvas() {
		if (isNullOrUndefined(this.props.stamp)) return;
		let stamp = this.props.stamp;
		if (this.props.tool === EditTool.Rectangle)
			stamp = stamp.extend(this.props.cursor.r - this.props.cursor.l + 1,
				this.props.cursor.b - this.props.cursor.t + 1);

		const canvas = this.canvasRef.current;
		canvas.width = stamp.width * this.props.tileSize;
		canvas.height = stamp.height * this.props.tileSize;
		const context = canvas.getContext('2d');
		stamp.tiles.forEach(tile => {
			const sx = tile.tileX * this.props.tileSize;
			const sy = tile.tileY * this.props.tileSize;
			const x = tile.positionX * this.props.tileSize;
			const y = tile.positionY * this.props.tileSize;
			if (this.props.tilesetImage && this.props.tilesetImage.element)
				context.drawImage(this.props.tilesetImage.element, sx, sy, this.props.tileSize,
					this.props.tileSize, x, y, this.props.tileSize, this.props.tileSize);
		});
	}

	public componentDidMount() {
		this.renderCanvas();
	}

	public componentDidUpdate() {
		this.renderCanvas();
	}

	private renderTiles() {
		if (isNullOrUndefined(this.props.stamp)) return '';
		const width = this.props.tool === EditTool.Rectangle ?
			(this.props.cursor.r - this.props.cursor.l + 1) * this.props.tileSize :
			this.props.stamp.width * this.props.tileSize;
		const height = this.props.tool === EditTool.Rectangle ?
			(this.props.cursor.b - this.props.cursor.t + 1) * this.props.tileSize :
			this.props.stamp.height * this.props.tileSize;

		return <div
			style={{
				position: 'absolute',
				left: this.props.cursor.l * this.props.tileSize,
				top: this.props.cursor.t * this.props.tileSize,
				width,
				height,
				overflow: 'hidden',
				opacity: this.props.tool === EditTool.Stamp ? 0 : .67,
				pointerEvents: 'none',
			}}
		>
			<canvas ref={this.canvasRef}/>
		</div>;
	}

	public render() {
		return <div>
			<GenericCursor
				tileSize={this.props.tileSize}
				cursor={this.props.cursor}
				removing={this.props.removing}
			/>
			{this.renderTiles()}
		</div>;
	}
}
