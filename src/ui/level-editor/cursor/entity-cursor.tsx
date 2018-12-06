import React from 'react';
import Image from '../../../data/image';
import Entity from '../../../data/project/entity/entity';

interface Props {
	/** The tile size of the grid. */
	tileSize: number;
	/** The x position of the cursor. */
	x: number;
	/** The y position of the cursor. */
	y: number;
	/** The currently selected entity. */
	entity: Entity;
	/** The loaded images for the project. */
	images: Map<string, Image>;
}

const EntityCursor = (props: Props) =>
	(context: CanvasRenderingContext2D) => {
		if (!props.entity) return;
		if (props.entity.data.imagePath) {
			const image = props.images.get(props.entity.data.imagePath);
			if (!image) return;
			if (!image.element) return;
			context.imageSmoothingEnabled = false;
			context.drawImage(image.element, props.x * props.tileSize,
				props.y * props.tileSize);
		} else {
			context.fillStyle = props.entity.data.color;
			context.fillRect(props.x * props.tileSize, props.y * props.tileSize,
				props.entity.data.width * props.tileSize,
				props.entity.data.height * props.tileSize);
		}
	};

export default EntityCursor;
