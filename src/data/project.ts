import Tileset from "../data/tileset";

/** The data used by the Project class. */
export interface ProjectData {
	/** The name of the project. */
	readonly name: string;
	/** The tile size of levels in this project (in pixels). */
	readonly tileSize: number;
	/** The default width of levels in this project (in tiles). */
	readonly defaultMapWidth: number;
	/** The default height of levels in this project (in tiles). */
	readonly defaultMapHeight: number;
	/** The maximum width of levels in this project (in tiles). */
	readonly maxMapWidth: number;
	/** The maximum height of levels in this project (in tiles). */
	readonly maxMapHeight: number;
	/** A list of the tilesets that can be used by levels in this project. */
	tilesets: Tileset[];
	/** A list of the entities that can be used by levels in this project. */
	// entities: Entity[];
}

/** A project containing the settings for a game's levels. */
export default class Project {
	public readonly data: ProjectData = {
		name: 'New project',
		tileSize: 16,
		defaultMapWidth: 16,
		defaultMapHeight: 9,
		maxMapWidth: 1000,
		maxMapHeight: 1000,
		tilesets: [],
	};

	constructor(data?: Partial<ProjectData>) {
		this.data = {...this.data, ...data};
	}

	public getImagePaths(): string[] {
		const paths: string[] = [];
		for (const tileset of this.data.tilesets)
			if (tileset.data.imagePath) paths.push(tileset.data.imagePath);
		return paths;
	}

	public getTileset(tilesetName: string): Tileset {
		return this.data.tilesets.find(tileset => tileset.data.name === tilesetName);
	}

	public setName(name: string): Project {
		return new Project({...this.data, name});
	}

	public setTileSize(tileSize: number): Project {
		return new Project({...this.data, tileSize});
	}

	public setDefaultMapWidth(defaultMapWidth: number): Project {
		return new Project({...this.data, defaultMapWidth});
	}

	public setDefaultMapHeight(defaultMapHeight: number): Project {
		return new Project({...this.data, defaultMapHeight});
	}

	public setMaxMapWidth(maxMapWidth: number): Project {
		return new Project({...this.data, maxMapWidth});
	}

	public setMaxMapHeight(maxMapHeight: number): Project {
		return new Project({...this.data, maxMapHeight});
	}

	public addTileset(): Project {
		const tilesets = this.data.tilesets.slice(0, this.data.tilesets.length);
		tilesets.push(new Tileset());
		return new Project({...this.data, tilesets});
	}

	public removeTileset(tilesetIndex: number): Project {
		const tilesets = this.data.tilesets.slice(0, this.data.tilesets.length);
		tilesets.splice(tilesetIndex, 1);
		return new Project({...this.data, tilesets});
	}

	public moveTilesetUp(tilesetIndex: number): Project {
		if (!(tilesetIndex > 0 && this.data.tilesets[tilesetIndex])) return this;
		const tilesets = this.data.tilesets.slice(0, this.data.tilesets.length);
		tilesets.splice(tilesetIndex - 1, 0, tilesets.splice(tilesetIndex, 1)[0]);
		return new Project({...this.data, tilesets});
	}

	public moveTilesetDown(tilesetIndex: number): Project {
		if (!(tilesetIndex < this.data.tilesets.length - 1 && this.data.tilesets[tilesetIndex])) return this;
		const tilesets = this.data.tilesets.slice(0, this.data.tilesets.length);
		tilesets.splice(tilesetIndex + 1, 0, tilesets.splice(tilesetIndex, 1)[0]);
		return new Project({...this.data, tilesets});
	}

	public setTileset(tilesetIndex: number, tileset: Tileset): Project {
		const tilesets = this.data.tilesets.slice(0, this.data.tilesets.length);
		tilesets[tilesetIndex] = tileset;
		return new Project({...this.data, tilesets});
	}
}
