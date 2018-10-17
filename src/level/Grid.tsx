import React from 'react';
import Project from '../data/Project';
import Level from '../data/Level';

const gridRenderingScale = 2;

export interface Props {
	tileSize: number,
	width: number,
	height: number,
	onMouseMove: (x: number, y: number) => void,
	onMouseEnter: () => void,
	onMouseLeave: () => void,
}

export default class Grid extends React.Component<Props> {
	canvasRef = React.createRef<HTMLCanvasElement>();

	renderCanvas() {
		const canvas = this.canvasRef.current;
		canvas.width = this.props.width * this.props.tileSize * gridRenderingScale;
		canvas.height = this.props.height * this.props.tileSize * gridRenderingScale;
		const context = canvas.getContext('2d');
		context.strokeStyle = '#bbb';
		for (let x = 1; x < this.props.width; x++) {
			context.moveTo(x * this.props.tileSize * gridRenderingScale, 0);
			context.lineTo(x * this.props.tileSize * gridRenderingScale,
				this.props.height * this.props.tileSize * gridRenderingScale);
			context.stroke();
		}
		for (let y = 1; y < this.props.height; y++) {
			context.moveTo(0, y * this.props.tileSize * gridRenderingScale);
			context.lineTo(this.props.width * this.props.tileSize * gridRenderingScale,
				y * this.props.tileSize * gridRenderingScale);
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
			style={{
				position: 'absolute',
				left: 0,
				top: 0,
				border: '1px solid black',
				transform: 'scale(' + (1 / gridRenderingScale) + ')',
				transformOrigin: '0% 0%',
			}}
			onMouseMove={(event) => {
				let rect = this.canvasRef.current.getBoundingClientRect();
				this.props.onMouseMove(event.clientX - rect.left, event.clientY - rect.top);
			}}
			onMouseEnter={this.props.onMouseEnter}
			onMouseLeave={this.props.onMouseLeave}
		/>;
	}
}