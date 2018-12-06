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
const TileCursor = (props: Props) =>
	(context: CanvasRenderingContext2D) => {
		GenericCursor({
			tileSize: props.tileSize,
			cursor: props.cursor,
			removing: props.removing,
		})(context);
		if (isNullOrUndefined(props.stamp)) return;
		let stamp = props.stamp;
		if (props.tool === EditTool.Rectangle)
			stamp = stamp.extend(props.cursor.r - props.cursor.l + 1,
				props.cursor.b - props.cursor.t + 1);
		const cursorX = props.cursor.l * props.tileSize;
		const cursorY = props.cursor.t * props.tileSize;
		stamp.tiles.forEach(tile => {
			const sx = tile.tileX * props.tileSize;
			const sy = tile.tileY * props.tileSize;
			const x = cursorX + tile.positionX * props.tileSize;
			const y = cursorY + tile.positionY * props.tileSize;
			if (props.tilesetImage && props.tilesetImage.element)
				context.drawImage(props.tilesetImage.element, sx, sy, props.tileSize,
					props.tileSize, x, y, props.tileSize, props.tileSize);
		});
	};

export default TileCursor;
