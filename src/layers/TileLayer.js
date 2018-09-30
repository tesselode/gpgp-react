import React, { Component } from 'react';

export default class TileLayer extends Component {
	renderCanvas() {
		const canvas = this.refs.canvas;
		canvas.width = this.props.mapWidth * this.props.tileSize;
		canvas.height = this.props.mapHeight * this.props.tileSize;
		const context = canvas.getContext('2d');
		const image = this.refs.image;
		for (let i = 0; i < this.props.data.length; i++) {
			const tile = this.props.data[i];
			let sx = tile.tileX * this.props.tileSize;
			let sy = tile.tileY * this.props.tileSize;
			let x = tile.x * this.props.tileSize;
			let y = tile.y * this.props.tileSize;
			context.drawImage(image, sx, sy, this.props.tileSize, this.props.tileSize,
				x, y, this.props.tileSize, this.props.tileSize);
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
				ref='canvas'
				style={{
					position: 'absolute',
					zIndex: this.props.order,
					left: 0,
					top: 0,
					pointerEvents: 'none',
				}}
			/>
			<img
				ref='image'
				src={this.props.tileset.image}
				style={{display: 'none'}}
			/>
		</div>;
	}
}
