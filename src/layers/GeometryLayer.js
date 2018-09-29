import React, { Component } from 'react';

export default class GeometryLayer extends Component {
	renderCanvas() {
		const canvas = this.refs.canvas;
		canvas.width = this.props.mapWidth * this.props.tileSize;
		canvas.height = this.props.mapHeight * this.props.tileSize;
		const context = canvas.getContext('2d');
		context.fillStyle = 'rgba(39, 187, 232, .33)';
		for (let i = 0; i < this.props.data.length; i++) {
			const tile = this.props.data[i];
			context.fillRect(tile.x * this.props.tileSize + 1,
				tile.y * this.props.tileSize + 1,
				this.props.tileSize,
				this.props.tileSize);
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
			ref='canvas'
			style={{
				position: 'absolute',
				left: 0,
				top: 0,
				pointerEvents: 'none',
			}}
		/>;
	}
}
