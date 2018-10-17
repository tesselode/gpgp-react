import React from 'react';
import Level from '../data/Level';
import Grid from './Grid';
import { LayerType } from '../data/layer/Layer';
import GeometryLayerDisplay from './layer/GeometryLayerDisplay';
import Project from '../data/Project';

export interface Props {
	level: Level,
	project: Project,
	onPlace: (x: number, y: number) => void,
	onRemove: (x: number, y: number) => void,
	onMouseUp: () => void,
}

export interface State {
	zoom: number,
	cursorX: number,
	cursorY: number,
	cursorOverGrid: boolean,
	mouseDown: number | boolean,
}

export default class GridEditor extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			zoom: 2,
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
		let scale = this.props.project.tileSize * this.state.zoom;
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

	onMouseUp() {
		this.props.onMouseUp();
		this.setState({mouseDown: false});
	}

	onWheel(event) {
		event.preventDefault();
		if (event.deltaY > 0) {
			this.setState({zoom: this.state.zoom / 1.1});
		}
		if (event.deltaY < 0) {
			this.setState({zoom: this.state.zoom * 1.1});
		}
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
			onWheel={this.onWheel.bind(this)}
		>
			<div
				style={{
					width: 0,
					height: 0,
					transformOrigin: '0% 0%',
					transform: 'scale(' + this.state.zoom + ')',
					imageRendering: 'pixelated',
					transition: '.15s',
				}}
			>
				<Grid
					tileSize={this.props.project.tileSize}
					width={this.props.level.width}
					height={this.props.level.height}
					onMouseMove={this.onMouseMove.bind(this)}
					onMouseEnter={() => this.setState({cursorOverGrid: true})}
					onMouseLeave={() => this.setState({cursorOverGrid: false})}
				/>
				{this.props.level.layers.map(layer => {
					switch (layer.type) {
						case LayerType.Geometry:
							return <GeometryLayerDisplay
								project={this.props.project}
								level={this.props.level}
								layer={layer}
							/>
						default:
							return '';
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
			</div>
		</div>;
	}
}
