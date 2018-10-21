import React from 'react';
import TileLayer from '../../data/layer/TileLayer';
import Level from '../../data/Level';
import Project from '../../data/Project';
import { TilesetImage } from '../../data/ProjectResources';

export interface Props {
	project: Project;
	level: Level;
	layer: TileLayer;
	tilesetImageData: TilesetImage;
}

export default class TileLayerDisplay extends React.Component<Props> {
	canvasRef = React.createRef<HTMLCanvasElement>();
	imageRef = React.createRef<HTMLImageElement>();

	renderCanvas() {
		const canvas = this.canvasRef.current;
		canvas.width = this.props.level.width * this.props.project.tileSize;
		canvas.height = this.props.level.height * this.props.project.tileSize;
		const context = canvas.getContext('2d');
		for (let i = 0; i < this.props.layer.items.length; i++) {
			const item = this.props.layer.items[i];
			let sx = item.tileX * this.props.project.tileSize;
			let sy = item.tileY * this.props.project.tileSize;
			let x = item.x * this.props.project.tileSize;
			let y = item.y * this.props.project.tileSize;
			context.drawImage(this.imageRef.current, sx, sy, this.props.project.tileSize, this.props.project.tileSize,
				x, y, this.props.project.tileSize, this.props.project.tileSize);
		}
	}

	componentDidMount() {
		this.renderCanvas();
	}

	componentDidUpdate() {
		this.renderCanvas();
	}

	render() {
		return <div>
			<canvas
				ref={this.canvasRef}
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					pointerEvents: 'none',
				}}
			/>
			<img
				ref={this.imageRef}
				src={this.props.tilesetImageData.data}
				alt=''
				style={{display: 'none'}}
			/>
		</div>;
	}
}
