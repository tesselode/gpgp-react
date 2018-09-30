import React, { Component } from 'react';

const gridRenderingScale = 2;

export default class Grid extends Component {
	renderCanvas() {
		const canvas = this.refs.canvas;
		canvas.width = this.props.mapWidth * this.props.tileSize * gridRenderingScale;
		canvas.height = this.props.mapHeight * this.props.tileSize * gridRenderingScale;
		if (!this.props.visible) return;
		const context = canvas.getContext('2d');
		context.strokeStyle = '#bbb';
		for (let x = 1; x < this.props.mapWidth; x++) {
			context.moveTo(x * this.props.tileSize * gridRenderingScale, 0);
			context.lineTo(x * this.props.tileSize * gridRenderingScale, this.props.mapHeight * this.props.tileSize * gridRenderingScale);
			context.stroke();
		}
		for (let y = 1; y < this.props.mapHeight; y++) {
			context.moveTo(0, y * this.props.tileSize * gridRenderingScale);
			context.lineTo(this.props.mapWidth * this.props.tileSize * gridRenderingScale, y * this.props.tileSize * gridRenderingScale);
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
				zIndex: this.props.order,
				border: '1px solid black',
				transform: 'scale(' + (1 / gridRenderingScale) + ')',
				transformOrigin: '0% 0%',
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
