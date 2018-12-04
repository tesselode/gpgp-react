import React from 'react';
import GeometryLayer from '../../../data/level/layer/geometry-layer';
import Level from '../../../data/level/level';
import Project from '../../../data/project/project';

interface Props {
	/** The project the level is for. */
	project: Project;
	/** The level the layer belongs to. */
	level: Level;
	/** The geometry layer to display. */
	layer: GeometryLayer;
	/** The depth the layer should be displayed at. */
	order: number;
}

/** A visual representation of a geometry layer in a level. */
export default class GeometryLayerDisplay extends React.Component<Props> {
	private canvasRef = React.createRef<HTMLCanvasElement>();

	private resizeCanvas(width: number, height: number) {
		console.log('resizing canvas to ', width, height);
		const tileSize = this.props.project.data.tileSize;
		const canvas = this.canvasRef.current;
		const context = canvas.getContext('2d');
		const imageData = context.getImageData(0, 0, width * tileSize, height * tileSize);
		canvas.width = width * tileSize;
		canvas.height = height * tileSize;
		context.putImageData(imageData, 0, 0);
	}

	private onPlace(x, y) {
		console.log('placing tile at ', x, y);
		const tileSize = this.props.project.data.tileSize;
		const canvas = this.canvasRef.current;
		const context = canvas.getContext('2d');
		context.fillStyle = 'rgba(39, 187, 232, .33)';
		context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
	}

	private onRemove(x, y) {
		console.log('removing tile at ', x, y);
		const tileSize = this.props.project.data.tileSize;
		const canvas = this.canvasRef.current;
		const context = canvas.getContext('2d');
		context.clearRect(x * tileSize, y * tileSize, tileSize, tileSize);
	}

	public componentDidMount() {
		const canvas = this.canvasRef.current;
		canvas.width = this.props.level.data.width * this.props.project.data.tileSize;
		canvas.height = this.props.level.data.height * this.props.project.data.tileSize;
		const context = canvas.getContext('2d');
		context.fillStyle = 'rgba(39, 187, 232, .33)';
		for (const item of this.props.layer.data.items)
			this.onPlace(item.x, item.y);
	}

	public shouldComponentUpdate(nextProps: Props): boolean {
		const currentLevelData = this.props.level.data;
		const nextLevelData = nextProps.level.data;
		if (nextLevelData.width !== currentLevelData.width || nextLevelData.height !== currentLevelData.height)
			this.resizeCanvas(nextLevelData.width, nextLevelData.height);
		for (let x = 0; x < nextLevelData.width; x++) {
			for (let y = 0; y < nextLevelData.width; y++) {
				if (this.props.layer.hasItemAt(x, y) && !nextProps.layer.hasItemAt(x, y))
					this.onRemove(x, y);
				else if (!this.props.layer.hasItemAt(x, y) && nextProps.layer.hasItemAt(x, y))
					this.onPlace(x, y);
			}
		}
		return false;
	}

	public render() {
		return <canvas
			ref={this.canvasRef}
			style={{
				position: 'absolute',
				zIndex: this.props.order,
				left: 0,
				top: 0,
				pointerEvents: 'none',
			}}
		/>;
	}
}
