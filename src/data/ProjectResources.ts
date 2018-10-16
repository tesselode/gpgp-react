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

export function loadProjectResources(project: Project, cb: (resources: ProjectResources) => void) {
	let resources: ProjectResources = {
		tilesetImages: new Map<Tileset, TilesetImage>(),
	};

	let tilesetsLoaded = 0;
	function setTilesetImage(tileset: Tileset, image: TilesetImage) {
		resources.tilesetImages.set(tileset, image);
		tilesetsLoaded++;
		if (tilesetsLoaded == project.tilesets.length)
			cb(resources);
	}
	
	project.tilesets.forEach(tileset => {
		Jimp.read(tileset.imagePath, (error, image) => {
			if (error)
				setTilesetImage(tileset, {
					error: "The tileset image could not be read.",
				});
			else {
				image.getBase64(Jimp.AUTO, (error, data) => {
					if (error)
						setTilesetImage(tileset, {
							error: "The image data could not be created."
						});
					else {
						setTilesetImage(tileset, {
							data: data,
							width: image.bitmap.width,
							height: image.bitmap.height,
						});
					}
				});
			}
		})
	});
}
