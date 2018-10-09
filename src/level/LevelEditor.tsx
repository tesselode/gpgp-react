import React from 'react';
import Level from '../data/Level';
import { LayerType } from '../data/layer/Layer';
import GridEditor from './GridEditor';
import HistoryList, { addHistory, getCurrentHistoryState } from '../data/HistoryList';

export interface State {
	levelHistory: HistoryList<Level>;
	selectedLayerIndex: number;
}

export default class LevelEditor extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			levelHistory: {
				position: 0,
				steps: [
					{
						description: 'New level',
						data: {
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
								},
							],
						},
					},
				],
			},
			selectedLayerIndex: 0,
		}
	}

	onPlace(x: number, y: number) {
		this.setState({
			levelHistory: addHistory(this.state.levelHistory, level => {
				let layer = level.layers[this.state.selectedLayerIndex];
				layer.tiles.push({x: x, y: y});
				return 'Place tiles';
			})
		})
	}

	onRemove(x: number, y: number) {
		this.setState({
			levelHistory: addHistory(this.state.levelHistory, level => {
				let layer = level.layers[this.state.selectedLayerIndex];
				layer.tiles = layer.tiles.filter(tile => !(tile.x === x && tile.y === y));
				return 'Remove tiles';
			})
		})
	}

	render() {
		return <div>
			<GridEditor
				level={getCurrentHistoryState(this.state.levelHistory)}
				onPlace={this.onPlace.bind(this)}
				onRemove={this.onRemove.bind(this)}
			/>
			{this.state.levelHistory.position}
		</div>;
	}
}
