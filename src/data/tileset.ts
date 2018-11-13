/** The data used by the Tileset class. */
export interface TilesetData {
	/** The name of the tileset. */
	name: string;
	/** The path to the tileset image. */
	imagePath?: string;
}

/** The settings for a tileset. */
export default class Tileset {
	public readonly data: TilesetData = {
		name: 'New tileset',
	};

	constructor(data?: Partial<TilesetData>) {
		this.data = {...this.data, ...data};
	}

	public setName(name: string): Tileset {
		return new Tileset({...this.data, name});
	}

	public setImagePath(imagePath: string): Tileset {
		return new Tileset({...this.data, imagePath});
	}
}
