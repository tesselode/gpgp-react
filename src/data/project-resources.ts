import Jimp from 'jimp';
import Project from "./project";

/** Data for a tileset image. */
export interface TilesetImage {
	/** The image data, suitable for use in an <img> tag. */
	data?: string;
	/** The width of the image (in pixels). */
	width?: number;
	/** The height of the image (in pixels). */
	height?: number;
	/** The error message returned if there was an issue loading the tileset image. */
	error?: string;
}

/** The data used by a proejct. */
export interface ProjectResources {
	/** The image data for each tileset in the project. */
	tilesetImages: TilesetImage[];
}

/**
 * Creates a new, empty project resources object.
 */
export function newProjectResources(): ProjectResources {
	return {
		tilesetImages: [],
	};
}

/**
 * Loads a tileset image from a file.
 * @param imagePath The path to the image file.
 */
export function loadTilesetImage(imagePath: string): Promise<TilesetImage> {
	return Jimp.read(imagePath)
		.then(image =>
			image.getBase64Async(image.getMIME())
				.then(data => ({
					data,
					width: image.bitmap.width,
					height: image.bitmap.height,
				})),
		)
		.catch(error => ({
			error: "The tileset image could not be loaded.",
		}));
}

/**
 * Loads the data for a project.
 * @param project The project to load data for.
 */
export function loadProjectResources(project: Project): Promise<ProjectResources> {
	const resources = newProjectResources();
	return Promise.all(project.tilesets.map((tileset, i) =>
		loadTilesetImage(tileset.imagePath).then(image => {
			resources.tilesetImages[i] = image;
		}),
	)).then(() => resources);
}

/**
 * Creates a shallow copy of a project resources object.
 * This is useful for adding a new tileset image or changing
 * a single tileset image without mutating the original object.
 * @param projectResources The project resources to copy.
 */
export function shallowCopyProjectResources(projectResources: ProjectResources): ProjectResources {
	const resources = newProjectResources();
	resources.tilesetImages = projectResources.tilesetImages;
	return resources;
}
