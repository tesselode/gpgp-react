import React from 'react';
import Project from '../data/Project';
import Level from '../data/Level';
import Grid from './Grid';
import GeometryLayer from '../data/layer/GeometryLayer';
import GeometryLayerDisplay from './layer/GeometryLayerDisplay';

export interface Props {
	project: Project,
	level: Level,
	onPlace: (x: number, y: number) => void,
	onRemove: (x: number, y: number) => void,
}

export interface State {
	cursorX: number,
	cursorY: number,
	cursorOverGrid: boolean,
	mouseDown: number | boolean,
}

export default class Editor extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			cursorX: 0,
			cursorY: 0,
			cursorOverGrid: false,
			mouseDown: false,
		};
	}

	onCursorMove(x, y) {
		this.setState({cursorX: x, cursorY: y});
		if (!this.state.cursorOverGrid) return;
		switch (this.state.mouseDown) {
			case 0:
				this.props.onPlace(x, y);
				break;
			case 2:
				this.props.onRemove(x, y);
				break;
			default:
				break;
		}
	}

	onMouseMove(x, y) {
		let scale = this.props.project.tileSize;
		let relativeMouseX = x / scale;
		let relativeMouseY = y / scale;
		let cursorX = Math.min(Math.floor(relativeMouseX), this.props.level.width - 1);
		let cursorY = Math.min(Math.floor(relativeMouseY), this.props.level.height - 1);
		if (cursorX !== this.state.cursorX || cursorY !== this.state.cursorY)
			this.onCursorMove(cursorX, cursorY);
	}

	onMouseDown(event) {
		this.setState({mouseDown: event.button});
		if (!this.state.cursorOverGrid) return;
		switch (event.button) {
			case 0:
				this.props.onPlace(this.state.cursorX, this.state.cursorY);
				break;
			case 2:
				this.props.onRemove(this.state.cursorX, this.state.cursorY);
				break;
			default:
				break;
		}
	}

	onMouseUp(event) {
		this.setState({mouseDown: false});
	}

	render() {
		return <div
			style={{
				width: '100%',
				height: '100%',
				position: 'relative',
			}}
			onMouseDown={this.onMouseDown.bind(this)}
			onMouseUp={this.onMouseUp.bind(this)}
		>
			<Grid
				project={this.props.project}
				level={this.props.level}
				onMouseMove={this.onMouseMove.bind(this)}
				onMouseEnter={() => this.setState({cursorOverGrid: true})}
				onMouseLeave={() => this.setState({cursorOverGrid: false})}
			/>
			{this.props.level.layers.map(layer => {
				if (layer instanceof GeometryLayer) {
					return <GeometryLayerDisplay
						project={this.props.project}
						level={this.props.level}
						layer={layer}
					/>;
				}
			})}
			<div style={{
				opacity: this.state.cursorOverGrid ? 1 : 0,
				position: 'absolute',
				left: this.state.cursorX * this.props.project.tileSize + 1 + 'px',
				top: this.state.cursorY * this.props.project.tileSize + 1 + 'px',
				width: this.props.project.tileSize + 'px',
				height: this.props.project.tileSize + 'px',
				background: 'rgba(0, 0, 0, .1)',
				pointerEvents: 'none',
			}}/>
		</div>;
	}
}
