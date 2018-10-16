import Tileset from "./Tileset";
import Project from "./Project";
import Jimp from 'jimp';

export interface TilesetImage {
	data?: string;
	width?: number;
	height?: number;
	error?: string;
}

export interface ProjectResources {
	tilesetImages: Map<Tileset, TilesetImage>;
}

export function loadProjectResources(project: Project): Promise<ProjectResources> {
	let resources: ProjectResources = {
		tilesetImages: new Map<Tileset, TilesetImage>(),
	};

	let promises: Array<Promise<void>> = [];

	project.tilesets.forEach(tileset => {
		promises.push(Jimp.read(tileset.imagePath)
			.then(image => {
				image.getBase64Async(image.getMIME())
					.then(data => {
						resources.tilesetImages.set(tileset, {
							data: data,
							width: image.bitmap.width,
							height: image.bitmap.height,
						});
					});
			})
			.catch(error => {
				resources.tilesetImages.set(tileset, {
					error: "The tileset image could not be loaded.",
				});
			})
		);
	});

	return Promise.all(promises).then(() => resources);
}
