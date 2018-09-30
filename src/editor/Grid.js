import React, { Component } from 'react';

export default class Grid extends Component {
	renderCanvas() {
		const canvas = this.refs.canvas;
		canvas.width = this.props.mapWidth * this.props.tileSize;
		canvas.height = this.props.mapHeight * this.props.tileSize;
		const context = canvas.getContext('2d');
		context.strokeStyle = '#bbb';
		for (let x = 1; x < this.props.mapWidth; x++) {
			context.moveTo(x * this.props.tileSize, 0);
			context.lineTo(x * this.props.tileSize, this.props.mapHeight * this.props.tileSize);
			context.stroke();
		}
		for (let y = 1; y < this.props.mapHeight; y++) {
			context.moveTo(0, y * this.props.tileSize);
			context.lineTo(this.props.mapWidth * this.props.tileSize, y * this.props.tileSize);
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
			ref='canvas'
			style={{
				position: 'relative',
				zIndex: 1,
				border: '1px solid black',
			}}
			onMouseMove={(event) => {
				let rect = this.refs.canvas.getBoundingClientRect();
				this.props.onMouseMove(event.clientX - rect.left, event.clientY - rect.top);
			}}
			onMouseEnter={(event) => this.props.onMouseEnter()}
			onMouseLeave={(event) => this.props.onMouseLeave()}
		/>;
	}
}
