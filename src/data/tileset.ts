/** The settings for a tileset. */
export default interface Tileset {
	/** The name of the tileset. */
	name: string;
	/** The path to the tileset image. */
	imagePath?: string;
}

export function newTileset(): Tileset {
	return {
		name: 'New tileset',
	};
}
