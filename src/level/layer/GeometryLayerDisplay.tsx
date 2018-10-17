import React from 'react';
import Level from '../../data/Level';
import GeometryLayer from '../../data/layer/GeometryLayer';
import Project from '../../data/Project';

export interface Props {
	project: Project;
	level: Level;
	layer: GeometryLayer;
}

export default class GeometryLayerDisplay extends React.Component<Props> {
	canvasRef = React.createRef<HTMLCanvasElement>();

	renderCanvas() {
		const canvas = this.canvasRef.current;
		canvas.width = this.props.level.width * this.props.project.tileSize;
		canvas.height = this.props.level.height * this.props.project.tileSize;
		const context = canvas.getContext('2d');
		context.fillStyle = 'rgba(39, 187, 232, .33)';
		for (let i = 0; i < this.props.layer.tiles.length; i++) {
			const tile = this.props.layer.tiles[i];
			context.fillRect(tile.x * this.props.project.tileSize,
				tile.y * this.props.project.tileSize,
				this.props.project.tileSize,
				this.props.project.tileSize);
		}
	}

	componentDidMount() {
		this.renderCanvas();
	}

	componentDidUpdate() {
		this.renderCanvas();
	}

	render() {
		return <canvas
			ref={this.canvasRef}
			style={{
				position: 'absolute',
				left: 0,
				top: 0,
				pointerEvents: 'none',
			}}
		/>;
	}
}