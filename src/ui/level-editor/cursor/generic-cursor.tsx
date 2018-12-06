import Rect from '../../../data/rect';

interface Props {
	/** The tile size of the grid. */
	tileSize: number;
	/** The rectangular region of the cursor. */
	cursor: Rect;
	/** Whether the user is removing tiles. If so, the cursor will be red instead of blue. */
	removing?: boolean;
}

/** A visual representation of a rectangular cursor on a grid. */
const GenericCursor = (props: Props) =>
	(context: CanvasRenderingContext2D) => {
		context.fillStyle = props.removing ? 'rgba(255, 0, 0, .1)' : 'rgba(0, 0, 0, .1)';
		context.fillRect(props.cursor.l * props.tileSize,
			props.cursor.t * props.tileSize,
			(props.cursor.r - props.cursor.l + 1) * props.tileSize,
			(props.cursor.b - props.cursor.t + 1) * props.tileSize);
	};

export default GenericCursor;
