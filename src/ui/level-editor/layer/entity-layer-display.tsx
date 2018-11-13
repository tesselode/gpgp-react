import React from 'react';
import Image from '../../../data/image-data';
import Level from '../../../data/level';
import Project from '../../../data/project';

export interface Props {
	/** The project the level is for. */
	project: Project;
	/** The loaded images for the project. */
	images: Map<string, Image>;
	/** The level the layer belongs to. */
	level: Level;
	/** The entity layer to display. */
	//layer: EntityLayer;
	/** The depth the layer should be displayed at. */
	order: number;
	/** The currently selected entity layer item. */
	selectedEntityItemIndex?: number;
}

/** A visual representation of an entity layer in a level. */
/*export default class EntityLayerDisplay extends React.Component<Props> {
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
				const image = this.props.images.get(entity.imagePath);
				if (image && image.element) context.drawImage(image.element, x, y);
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
		const selectedItem = this.props.layer.items[this.props.selectedEntityItemIndex];
		const entity = selectedItem && getProjectEntity(this.props.project, selectedItem.entityName);

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
					left: selectedItem.x * this.props.project.tileSize + 'px',
					top: selectedItem.y * this.props.project.tileSize + 'px',
					width: this.props.project.tileSize * entity.width + 1 + 'px',
					height: this.props.project.tileSize * entity.height + 1 + 'px',
					border: '1px solid red',
					pointerEvents: 'none',
				}}
			/>}
		</div>;
	}
}
*/
