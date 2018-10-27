import Jimp from 'jimp';
import Project from "./project";

export interface TilesetImage {
	data?: string;
	width?: number;
	height?: number;
	error?: string;
}

export interface ProjectResources {
	tilesetImages: TilesetImage[];
}

export function newProjectResources(): ProjectResources {
	return {
		tilesetImages: [],
	};
}

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

export function loadProjectResources(project: Project): Promise<ProjectResources> {
	const resources = newProjectResources();
	return Promise.all(project.tilesets.map((tileset, i) =>
		loadTilesetImage(tileset.imagePath).then(image => {
			resources.tilesetImages[i] = image;
		}),
	)).then(() => resources);
}

export function shallowCopyProjectResources(projectResources: ProjectResources): ProjectResources {
	const resources = newProjectResources();
	resources.tilesetImages = projectResources.tilesetImages;
	return resources;
}
