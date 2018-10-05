import React from 'react';
import Project from '../data/Project';
import Level from '../data/Level';

const gridRenderingScale = 2;

export interface Props {
	project: Project,
	level: Level,
}

export default class Grid extends React.Component<Props> {
	canvasRef = React.createRef<HTMLCanvasElement>();

	renderCanvas() {
		const canvas = this.canvasRef.current;
		canvas.width = this.props.level.width * this.props.project.tileSize * gridRenderingScale;
		canvas.height = this.props.level.height * this.props.project.tileSize * gridRenderingScale;
		const context = canvas.getContext('2d');
		context.strokeStyle = '#bbb';
		for (let x = 1; x < this.props.level.width; x++) {
			context.moveTo(x * this.props.project.tileSize * gridRenderingScale, 0);
			context.lineTo(x * this.props.project.tileSize * gridRenderingScale, this.props.level.height * this.props.project.tileSize * gridRenderingScale);
			context.stroke();
		}
		for (let y = 1; y < this.props.level.height; y++) {
			context.moveTo(0, y * this.props.project.tileSize * gridRenderingScale);
			context.lineTo(this.props.level.width * this.props.project.tileSize * gridRenderingScale, y * this.props.project.tileSize * gridRenderingScale);
			context.stroke();
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
		/>;
	}
}
