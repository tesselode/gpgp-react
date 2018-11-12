import React from 'react';
import Image from '../../../data/image-data';
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
		canvas.width = this.props.level.width * this.props.project.tileSize;
		canvas.height = this.props.level.height * this.props.project.tileSize;
		const context = canvas.getContext('2d');
		for (const item of this.props.layer.items) {
			const sx = item.tileX * this.props.project.tileSize;
			const sy = item.tileY * this.props.project.tileSize;
			const x = item.x * this.props.project.tileSize;
			const y = item.y * this.props.project.tileSize;
			if (this.props.tilesetImage && this.props.tilesetImage.element)
				context.drawImage(this.props.tilesetImage.element, sx, sy, this.props.project.tileSize, this.props.project.tileSize,
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
