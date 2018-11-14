import React from 'react';
import Image from '../../../data/image';
import TileLayer from '../../../data/layer/tile-layer';
import Level from '../../../data/level';
import Project from '../../../data/project';

export interface Props {
	/** The project the level is for. */
	project: Project;
	/** The level the layer belongs to. */
	level: Level;
	/** The tile layer to display. */
	layer: TileLayer;
	/** The image element for the tileset used by the tile layer. */
	tilesetImage?: Image;
	/** The depth the layer should be displayed at. */
	order: number;
}

/** A visual representation of a tile layer in a level. */
export default class TileLayerDisplay extends React.Component<Props> {
	private canvasRef = React.createRef<HTMLCanvasElement>();

	private renderCanvas() {
		const canvas = this.canvasRef.current;
		canvas.width = this.props.level.data.width * this.props.project.data.tileSize;
		canvas.height = this.props.level.data.height * this.props.project.data.tileSize;
		const context = canvas.getContext('2d');
		for (const item of this.props.layer.data.items) {
			const sx = item.tileX * this.props.project.data.tileSize;
			const sy = item.tileY * this.props.project.data.tileSize;
			const x = item.x * this.props.project.data.tileSize;
			const y = item.y * this.props.project.data.tileSize;
			if (this.props.tilesetImage && this.props.tilesetImage.element)
				context.drawImage(this.props.tilesetImage.element, sx, sy, this.props.project.data.tileSize,
					this.props.project.data.tileSize, x, y, this.props.project.data.tileSize, this.props.project.data.tileSize);
		}
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
