import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Level, { newLevel } from '../data/Level';
import GridEditor from './GridEditor';
import HistoryList, { addHistory, getCurrentHistoryState, changeHistoryPosition } from '../data/HistoryList';
import LayerList from './sidebar/LayerList';
import HistoryBrowser from './sidebar/HistoryBrowser';
import Project, { newProject } from '../data/Project';

export interface State {
	project: Project;
	levelHistory: HistoryList<Level>;
	selectedLayerIndex: number;
	continuedAction: boolean;
}

export default class LevelEditor extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			project: newProject(),
			levelHistory: {
				position: 0,
				steps: [
					{
						description: 'New level',
						data: newLevel(),
					},
				],
			},
			selectedLayerIndex: 0,
			continuedAction: false,
		}
	}

	onPlace(x: number, y: number) {
		let level = getCurrentHistoryState(this.state.levelHistory);
		let layer = level.layers[this.state.selectedLayerIndex];
		for (let i = 0; i < layer.tiles.length; i++) {
			const tile = layer.tiles[i];
			if (tile.x === x && tile.y === y) return;
		}
		this.setState({
			continuedAction: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				let layer = level.layers[this.state.selectedLayerIndex];
				layer.tiles.push({x: x, y: y});
				return 'Place tiles';
			}, this.state.continuedAction)
		})
	}

	onRemove(x: number, y: number) {
		this.setState({
			continuedAction: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				let layer = level.layers[this.state.selectedLayerIndex];
				layer.tiles = layer.tiles.filter(tile => !(tile.x === x && tile.y === y));
				return 'Remove tiles';
			}, this.state.continuedAction)
		})
	}

	render() {
		let level = getCurrentHistoryState(this.state.levelHistory);
		return <Container fluid>
			<Row>
				<Col md={3}>
					<LayerList
						level={level}
						selectedLayerIndex={this.state.selectedLayerIndex}
						onSelectLayer={(layerIndex: number) => {}}
					/>
					<HistoryBrowser
						historyList={this.state.levelHistory}
						onHistoryPositionChanged={(position: number) => {
							this.setState({
								levelHistory: changeHistoryPosition(
									this.state.levelHistory,
									position
								),
							})
						}}
					/>
				</Col>
				<Col md={9}>
					<GridEditor
						level={level}
						project={this.state.project}
						onPlace={this.onPlace.bind(this)}
						onRemove={this.onRemove.bind(this)}
						onMouseUp={() => this.setState({continuedAction: false})}
					/>
				</Col>
			</Row>
		</Container>;
	}
}
