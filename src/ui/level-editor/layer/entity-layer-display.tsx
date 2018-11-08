import React from 'react';
import Project, { getProjectEntity } from '../../../data/project';
import Level from '../../../data/level';
import Image from '../../../data/image-data';
import EntityLayer from '../../../data/layer/entity-layer';

export interface Props {
	/** The project the level is for. */
	project: Project;
	/** The loaded images for the project. */
	images: Map<string, Image>;
	/** The level the layer belongs to. */
	level: Level;
	/** The entity layer to display. */
	layer: EntityLayer;
	/** The depth the layer should be displayed at. */
	order: number;
}

/** A visual representation of an entity layer in a level. */
export default class EntityLayerDisplay extends React.Component<Props> {
	private canvasRef = React.createRef<HTMLCanvasElement>();

	constructor(props) {
		super(props);
	}

	private renderCanvas() {
		const canvas = this.canvasRef.current;
		canvas.width = this.props.level.width * this.props.project.tileSize;
		canvas.height = this.props.level.height * this.props.project.tileSize;
		const context = canvas.getContext('2d');
		for (const item of this.props.layer.items) {
			const x = item.x * this.props.project.tileSize;
			const y = item.y * this.props.project.tileSize;
			const entity = getProjectEntity(this.props.project, item.entityName);
			if (entity.imagePath) {
				const image = this.props.images.get(entity.imagePath).element;
				if (image) context.drawImage(image, x, y);
			} else {
				context.fillStyle = entity.color;
				context.fillRect(x, y, this.props.project.tileSize, this.props.project.tileSize);
			}
		}
	}

	public componentDidMount() {
		this.renderCanvas();
	}

	public componentDidUpdate() {
		this.renderCanvas();
	}

	public render() {
		return <div>
			<canvas
				ref={this.canvasRef}
				style={{
					position: 'absolute',
					zIndex: this.props.order,
					left: 0,
					top: 0,
					pointerEvents: 'none',
				}}
			/>
		</div>;
	}
}
