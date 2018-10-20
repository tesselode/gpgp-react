import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Level, { newLevel } from '../data/Level';
import GridEditor from './GridEditor';
import HistoryList, { addHistory, getCurrentHistoryState, changeHistoryPosition } from '../data/HistoryList';
import LayerList from './sidebar/LayerList';
import HistoryBrowser from './sidebar/HistoryBrowser';
import Project, { newProject } from '../data/Project';
import { ProjectResources, loadProjectResources } from '../data/ProjectResources';
import { newGeometryLayer } from '../data/layer/GeometryLayer';

export interface Props {
	project: Project;
	projectFilePath: string;
	onChangeTabTitle: (title: string) => void;
	level?: Level;
	levelFilePath?: string;
}

export interface State {
	resources?: ProjectResources;
	levelHistory: HistoryList<Level>;
	levelFilePath?: string;
	selectedLayerIndex: number;
	continuedAction: boolean;
}

export default class LevelEditor extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			levelHistory: {
				position: 0,
				steps: [
					{
						description: 'New level',
						data: this.props.level ? this.props.level :
							newLevel(this.props.project, this.props.projectFilePath),
					},
				],
			},
			levelFilePath: this.props.levelFilePath,
			selectedLayerIndex: 0,
			continuedAction: false,
		}
		loadProjectResources(this.props.project).then(resources =>
			this.setState({resources: resources})
		);
	}

	onAddGeometryLayer() {
		this.setState({
			levelHistory: addHistory(this.state.levelHistory, level => {
				level.layers.splice(this.state.selectedLayerIndex, 0, newGeometryLayer())
				return 'Add geometry layer';
			})
		})
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
						onSelectLayer={(layerIndex: number) => this.setState({selectedLayerIndex: layerIndex})}
						onAddGeometryLayer={this.onAddGeometryLayer.bind(this)}
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
						project={this.props.project}
						onPlace={this.onPlace.bind(this)}
						onRemove={this.onRemove.bind(this)}
						onMouseUp={() => this.setState({continuedAction: false})}
					/>
				</Col>
			</Row>
		</Container>;
	}
}
