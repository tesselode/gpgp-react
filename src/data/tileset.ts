import path from 'path';

/** The data used by the Tileset class. */
export interface TilesetData {
	/** The name of the tileset. */
	name: string;
	/** The absolute path to the tileset image. */
	imagePath?: string;
}

/** The data used to define tilesets in a project file. */
export interface ExportedTilesetData {
	/** The name of the tileset. */
	name: string;
	/** The relative path to the tileset image. */
	imagePath?: string;
}

/** The settings for a tileset. */
export default class Tileset {
	public readonly data: TilesetData = {
		name: 'New tileset',
	};

	public static New(): Tileset {
		return new Tileset();
	}

	public static Import(data: ExportedTilesetData, projectFilePath: string): Tileset {
		return new Tileset({
			name: data.name,
			imagePath: data.imagePath &&
				path.resolve(path.dirname(projectFilePath), data.imagePath),
		});
	}

	private constructor(data?: Partial<TilesetData>) {
		this.data = {...this.data, ...data};
	}

	public setName(name: string): Tileset {
		return new Tileset({...this.data, name});
	}

	public setImagePath(imagePath: string): Tileset {
		return new Tileset({...this.data, imagePath});
	}

	public export(projectFilePath: string): ExportedTilesetData {
		return {
			name: this.data.name,
			imagePath: this.data.imagePath &&
				path.relative(path.dirname(projectFilePath), this.data.imagePath),
		};
	}
}
