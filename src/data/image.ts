import Jimp from 'jimp';

/** Data for an image. */
export default interface Image {
	/** The image element. */
	element?: HTMLImageElement;
	/** The image data, suitable for use in an <img> tag. */
	data?: string;
	/** The width of the image (in pixels). */
	width?: number;
	/** The height of the image (in pixels). */
	height?: number;
	/** The error message returned if there was an issue loading the image. */
	error?: string;
}

/**
 * Loads an image from a file.
 * @param imagePath The path to the image file.
 */
export function loadImage(imagePath: string): Promise<Image> {
	return Jimp.read(imagePath)
		.then(image =>
			image.getBase64Async(image.getMIME())
				.then(data =>
					new Promise((resolve, reject) => {
						const element = document.createElement('img');
						element.onload = () => {resolve({
							element,
							data,
							width: image.bitmap.width,
							height: image.bitmap.height,
						}); };
						element.src = data;
					}),
				),
		)
		.catch(error => ({
			error: 'The image could not be loaded.',
		}));
}
