import React from 'react';
import TileLayer from '../../../data/layer/tile-layer';
import Level from '../../../data/level';
import Project from '../../../data/project';
import { TilesetImage } from '../../../data/project-resources';

export interface Props {
	project: Project;
	level: Level;
	layer: TileLayer;
	tilesetImageData?: TilesetImage;
	order: number;
}

export default class TileLayerDisplay extends React.Component<Props> {
	private canvasRef = React.createRef<HTMLCanvasElement>();
	private imageRef = React.createRef<HTMLImageElement>();

	private renderCanvas() {
		const canvas = this.canvasRef.current;
		canvas.width = this.props.level.width * this.props.project.tileSize;
		canvas.height = this.props.level.height * this.props.project.tileSize;
		const context = canvas.getContext('2d');
		for (const item of this.props.layer.items) {
			const sx = item.tileX * this.props.project.tileSize;
			const sy = item.tileY * this.props.project.tileSize;
			const x = item.x * this.props.project.tileSize;
			const y = item.y * this.props.project.tileSize;
			context.drawImage(this.imageRef.current, sx, sy, this.props.project.tileSize, this.props.project.tileSize,
				x, y, this.props.project.tileSize, this.props.project.tileSize);
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
			<img
				ref={this.imageRef}
				src={this.props.tilesetImageData && this.props.tilesetImageData.data}
				alt=''
				style={{display: 'none'}}
				onLoad={() => this.renderCanvas()}
			/>
		</div>;
	}
}
