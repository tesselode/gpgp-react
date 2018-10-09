import React from 'react';
import Level from '../data/Level';
import { LayerType } from '../data/layer/Layer';
import GridEditor from './GridEditor';

export interface State {
	level: Level;
	selectedLayerIndex: number;
}

export default class LevelEditor extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			level: {
				project: {
					tileSize: 16,
				},
				width: 16,
				height: 9,
				layers: [
					{
						name: 'Geometry',
						type: LayerType.Geometry,
						tiles: [],
					}
				]
			},
			selectedLayerIndex: 0,
		}
	}

	onPlace(x: number, y: number) {
		let level: Level = JSON.parse(JSON.stringify(this.state.level));
		let layer = level.layers[this.state.selectedLayerIndex];
		layer.tiles.push({x: x, y: y});
		this.setState({level: level});
	}

	onRemove(x: number, y: number) {
		let level: Level = JSON.parse(JSON.stringify(this.state.level));
		let layer = level.layers[this.state.selectedLayerIndex];
		layer.tiles = layer.tiles.filter(tile => !(tile.x === x && tile.y === y));
		this.setState({level: level});
	}

	render() {
		return <GridEditor
			level={this.state.level}
			onPlace={this.onPlace.bind(this)}
			onRemove={this.onRemove.bind(this)}
		/>
	}
}
