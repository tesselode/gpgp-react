import React from 'react';
import Level from '../../data/Level';
import GeometryLayer from '../../data/layer/GeometryLayer';

export interface Props {
	level: Level,
	layer: GeometryLayer,
}

export default class GeometryLayerDisplay extends React.Component<Props> {
	canvasRef = React.createRef<HTMLCanvasElement>();

	renderCanvas() {
		const canvas = this.canvasRef.current;
		canvas.width = this.props.level.width * this.props.level.project.tileSize;
		canvas.height = this.props.level.height * this.props.level.project.tileSize;
		const context = canvas.getContext('2d');
		context.fillStyle = 'rgba(39, 187, 232, .33)';
		this.props.layer.tiles.forEach(tile => {
			context.fillRect(
				tile.x * this.props.level.project.tileSize,
				tile.y * this.props.level.project.tileSize,
				this.props.level.project.tileSize,
				this.props.level.project.tileSize
			);
		});
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
