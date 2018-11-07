import React from 'react';
import Entity from '../../data/entity';
import Image from '../../data/image-data';

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

const EntityCursor = (props: Props) => {
	if (!props.entity) return <div />;
	return <div
		style={{
			opacity: .67,
		}}
	>
		{props.entity.imagePath &&
			props.images.get(props.entity.imagePath) &&
			props.images.get(props.entity.imagePath).data ?
			<img
				src={props.images.get(props.entity.imagePath).data}
				alt=''
				style={{
					position: 'absolute',
					left: props.x * props.tileSize + 1 + 'px',
					top: props.y * props.tileSize + 1 + 'px',
					pointerEvents: 'none',
				}}
			/> : <div
				style={{
					position: 'absolute',
					left: props.x * props.tileSize + 1 + 'px',
					top: props.y * props.tileSize + 1 + 'px',
					width: props.tileSize * props.entity.width + 'px',
					height: props.tileSize * props.entity.height + 'px',
					background: props.entity.color,
				}}
			/>
		}
	</div>;
};

export default EntityCursor;
