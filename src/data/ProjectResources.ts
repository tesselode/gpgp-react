import Project from "./Project";
import Jimp from 'jimp';
import Tileset from "./Tileset";

export interface TilesetImage {
	data?: string;
	width?: number;
	height?: number;
	error?: string;
}

export interface ProjectResources {
	tilesetImages: Array<TilesetImage>;
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
					data: data,
					width: image.bitmap.width,
					height: image.bitmap.height,
				}))
		)
		.catch(error => ({
			error: "The tileset image could not be loaded.",
		}));
}

export function loadProjectResources(project: Project): Promise<ProjectResources> {
	let resources = newProjectResources();
	return Promise.all(project.tilesets.map((tileset, i) =>
		loadTilesetImage(tileset.imagePath).then(image => {
			resources.tilesetImages[i] = image;
		})
	)).then(() => resources);
}

export function shallowCopyProjectResources(projectResources: ProjectResources): ProjectResources {
	let resources = newProjectResources();
	resources.tilesetImages = projectResources.tilesetImages;
	return resources;
}
