/** The types of editing tools that can be used on a grid. */
export enum EditTool {
	/** Draws individual items by dragging over squares. */
	Pencil,
	/** Places rectangles of items. */
	Rectangle,
	/** Creates stamps for placing tiles. */
	Stamp,
	/** Moves all the tiles on a layer. */
	Shift,
}
