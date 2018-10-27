import React from 'react';
import GeometryLayer from '../../../data/layer/geometry-layer';
import Level from '../../../data/level';
import Project from '../../../data/project';

export interface Props {
	project: Project;
	level: Level;
	layer: GeometryLayer;
	order: number;
}

export default class GeometryLayerDisplay extends React.Component<Props> {
	private canvasRef = React.createRef<HTMLCanvasElement>();

	private renderCanvas() {
		const canvas = this.canvasRef.current;
		canvas.width = this.props.level.width * this.props.project.tileSize;
		canvas.height = this.props.level.height * this.props.project.tileSize;
		const context = canvas.getContext('2d');
		context.fillStyle = 'rgba(39, 187, 232, .33)';
		for (const item of this.props.layer.items)
			context.fillRect(item.x * this.props.project.tileSize,
				item.y * this.props.project.tileSize,
				this.props.project.tileSize,
				this.props.project.tileSize);
	}

	public componentDidMount() {
		this.renderCanvas();
	}

	public componentDidUpdate() {
		this.renderCanvas();
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
