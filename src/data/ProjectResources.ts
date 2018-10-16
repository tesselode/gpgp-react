import Tileset from "./Tileset";
import Project from "./Project";
const Jimp = (window as any).require('jimp');

export interface TilesetImage {
	data?: string;
	width?: number;
	height?: number;
	error?: string;
}

export interface ProjectResources {
	tilesetImages: Map<Tileset, TilesetImage>;
}

export function loadProjectResources(project: Project): ProjectResources {
	let resources: ProjectResources = {
		tilesetImages: new Map<Tileset, TilesetImage>(),
	};
	project.tilesets.forEach(tileset => {
		Jimp.read(tileset.imagePath, (error, image) => {
			if (error)
				resources.tilesetImages.set(tileset, {
					error: "The tileset image could not be read.",
				});
			else {
				image.getBase64(Jimp.AUTO, (error, data) => {
					if (error)
						resources.tilesetImages.set(tileset, {
							error: "The image data could not be created."
						});
					else {
						resources.tilesetImages.set(tileset, {
							data: data,
							width: image.bitmap.width,
							height: image.bitmap.height,
						});
					}
				});
			}
		})
	});
	return resources;
}
