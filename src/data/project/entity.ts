import path from 'path';

/** The data used by the Entity class. */
export interface EntityData {
	/** The name of the entity. */
	name: string;
	/** The width of the entity (in tiles). */
	width: number;
	/** The height of the entity (in tiles). */
	height: number;
	/** The hex color of the entity, if no image is specified. */
	color: string;
	/** The absolute path to the image representing the entity, if there is one. */
	imagePath?: string;
}

/** The data used to define entities in a project file.. */
export interface ExportedEntityData {
	/** The name of the entity. */
	name: string;
	/** The width of the entity (in tiles). */
	width: number;
	/** The height of the entity (in tiles). */
	height: number;
	/** The color of the entity, if no image is specified. */
	color: string;
	/** The relative path to the image representing the entity, if there is one. */
	imagePath?: string;
}

/** The settings for an entity. */
export default class Entity {
	public readonly data: EntityData = {
		name: 'New entity',
		width: 1,
		height: 1,
		color: '#ff0000',
	};

	public static New(): Entity {
		return new Entity();
	}

	public static Import(data: ExportedEntityData, projectFilePath: string): Entity {
		return new Entity({
			name: data.name,
			width: data.width,
			height: data.height,
			color: data.color,
			imagePath: data.imagePath &&
				path.resolve(path.dirname(projectFilePath), data.imagePath),
		});
	}

	private constructor(data?: Partial<EntityData>) {
		this.data = {...this.data, ...data};
	}

	public setName(name: string): Entity {
		return new Entity({...this.data, name});
	}

	public setWidth(width: number): Entity {
		return new Entity({...this.data, width});
	}

	public setHeight(height: number): Entity {
		return new Entity({...this.data, height});
	}

	public setColor(color: string): Entity {
		return new Entity({...this.data, color});
	}

	public setImagePath(imagePath: string): Entity {
		return new Entity({...this.data, imagePath});
	}

	public clearImagePath(): Entity {
		return new Entity({...this.data, imagePath: null});
	}

	public export(projectFilePath: string): ExportedEntityData {
		return {
			name: this.data.name,
			width: this.data.width,
			height: this.data.height,
			color: this.data.color,
			imagePath: this.data.imagePath &&
				path.relative(path.dirname(projectFilePath), this.data.imagePath),
		};
	}
}
