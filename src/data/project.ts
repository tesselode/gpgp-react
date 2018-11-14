import Tileset, { ExportedTilesetData } from "../data/tileset";

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
	readonly tilesets: Tileset[];
}

/** The data used to save project data to a file. */
export interface ExportedProjectData {
	/** The name of the project. */
	name: string;
	/** The tile size of levels in this project (in pixels). */
	tileSize: number;
	/** The default width of levels in this project (in tiles). */
	defaultMapWidth: number;
	/** The default height of levels in this project (in tiles). */
	defaultMapHeight: number;
	/** The maximum width of levels in this project (in tiles). */
	maxMapWidth: number;
	/** The maximum height of levels in this project (in tiles). */
	maxMapHeight: number;
	/** A list of the tilesets that can be used by levels in this project. */
	tilesets: ExportedTilesetData[];
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

	public static New(): Project {
		return new Project();
	}

	public static Import(data: ExportedProjectData, projectFilePath: string): Project {
		return new Project({
			name: data.name,
			tileSize: data.tileSize,
			defaultMapWidth: data.defaultMapWidth,
			defaultMapHeight: data.defaultMapHeight,
			maxMapWidth: data.maxMapWidth,
			maxMapHeight: data.maxMapHeight,
			tilesets: data.tilesets.map(tilesetData => Tileset.Import(tilesetData, projectFilePath)),
		});
	}

	private constructor(data?: Partial<ProjectData>) {
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
		tilesets.push(Tileset.New());
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

	public export(projectFilePath: string): ExportedProjectData {
		return {
			name: this.data.name,
			tileSize: this.data.tileSize,
			defaultMapWidth: this.data.defaultMapWidth,
			defaultMapHeight: this.data.defaultMapHeight,
			maxMapWidth: this.data.maxMapWidth,
			maxMapHeight: this.data.maxMapHeight,
			tilesets: this.data.tilesets.map(tileset => tileset.export(projectFilePath)),
		};
	}
}
