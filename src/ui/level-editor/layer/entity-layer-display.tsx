import React from 'react';
import Image from '../../../data/image';
import EntityLayer from '../../../data/level/layer/entity-layer';
import Level from '../../../data/level/level';
import Project from '../../../data/project/project';

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
	/** The currently selected entity layer item. */
	selectedEntityItemIndex?: number;
}

/** A visual representation of an entity layer in a level. */
export default class EntityLayerDisplay extends React.Component<Props> {
	private canvasRef = React.createRef<HTMLCanvasElement>();

	constructor(props) {
		super(props);
	}

	private renderCanvas() {
		const canvas = this.canvasRef.current;
		canvas.width = this.props.level.data.width * this.props.project.data.tileSize;
		canvas.height = this.props.level.data.height * this.props.project.data.tileSize;
		const context = canvas.getContext('2d');
		for (const item of this.props.layer.data.items) {
			const x = item.x * this.props.project.data.tileSize;
			const y = item.y * this.props.project.data.tileSize;
			const entity = this.props.project.getEntity(item.entityName);
			if (entity.data.imagePath) {
				const image = this.props.images.get(entity.data.imagePath);
				if (image && image.element) context.drawImage(image.element, x, y);
			} else {
				context.fillStyle = entity.data.color;
				context.fillRect(x, y, this.props.project.data.tileSize, this.props.project.data.tileSize);
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
		const selectedItem = this.props.layer.data.items[this.props.selectedEntityItemIndex];
		const entity = selectedItem && this.props.project.getEntity(selectedItem.entityName);

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
			{selectedItem && <div
				style={{
					position: 'absolute',
					zIndex: 2,
					left: selectedItem.x * this.props.project.data.tileSize + 'px',
					top: selectedItem.y * this.props.project.data.tileSize + 'px',
					width: this.props.project.data.tileSize * entity.data.width + 'px',
					height: this.props.project.data.tileSize * entity.data.height + 'px',
					outline: '1px solid red',
					pointerEvents: 'none',
				}}
			/>}
		</div>;
	}
}
