import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Level, { newLevel } from '../data/Level';
import HistoryList, { addHistory, getCurrentHistoryState, changeHistoryPosition } from '../data/HistoryList';
import LevelOptions from './sidebar/LevelOptions';
import LayerList from './sidebar/LayerList';
import HistoryBrowser from './sidebar/HistoryBrowser';
import Project from '../data/Project';
import { ProjectResources, loadProjectResources } from '../data/ProjectResources';
import { newGeometryLayer } from '../data/layer/GeometryLayer';
import { newTileLayer, isTileLayer } from '../data/layer/TileLayer';
import { LayerType } from '../data/layer/Layer';
import TilePicker from './sidebar/TilePicker';
import GeometryLayerDisplay from './layer/GeometryLayerDisplay';
import Grid from './Grid';
import TileLayerDisplay from './layer/TileLayerDisplay';
import LayerOptions from './sidebar/LayerOptions';
import { shiftUp, shiftDown } from '../util';

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
	showSelectedLayerOnTop: boolean;
	selectedLayerIndex: number;
	selectedTileX: number;
	selectedTileY: number;
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
			showSelectedLayerOnTop: true,
			selectedLayerIndex: 0,
			selectedTileX: 0,
			selectedTileY: 0,
			continuedAction: false,
		}
		loadProjectResources(this.props.project).then(resources =>
			this.setState({resources: resources})
		);
	}

	onChangeLevelWidth(width: number) {
		this.setState({
			continuedAction: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				level.width = width;
				return 'Change level width';
			}, this.state.continuedAction)
		});
	}

	onChangeLevelHeight(height: number) {
		this.setState({
			continuedAction: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				level.height = height;
				return 'Change level height';
			}, this.state.continuedAction)
		});
	}

	onAddGeometryLayer() {
		this.setState({
			levelHistory: addHistory(this.state.levelHistory, level => {
				level.layers.splice(this.state.selectedLayerIndex, 0, newGeometryLayer())
				return 'Add geometry layer';
			})
		})
	}

	onAddTileLayer(tilesetIndex: number) {
		this.setState({
			levelHistory: addHistory(this.state.levelHistory, level => {
				level.layers.splice(this.state.selectedLayerIndex, 0, newTileLayer(tilesetIndex))
				return 'Add tile layer';
			})
		})
	}

	onToggleLayerVisibility(layerIndex: number) {
		this.setState({
			levelHistory: addHistory(this.state.levelHistory, level => {
				let layer = level.layers[layerIndex];
				layer.visible = !layer.visible;
				return layer.visible ? 'Show layer "' + layer.name + '"'
				: 'Hide layer "' + layer.name + '"'
			})
		})
	}

	onChangeLayerName(name: string) {
		this.setState({
			continuedAction: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				level.layers[this.state.selectedLayerIndex].name = name;
				return 'Rename layer to "' + name + '"';
			}, this.state.continuedAction)
		})
	}

	onMoveLayerUp() {
		this.setState({
			levelHistory: addHistory(this.state.levelHistory, level => {
				if (this.state.selectedLayerIndex === 0) return false;
				let layer = level.layers[this.state.selectedLayerIndex];
				shiftUp(level.layers, this.state.selectedLayerIndex);
				this.setState({
					selectedLayerIndex: this.state.selectedLayerIndex - 1,
				});
				return 'Move layer "' + layer.name + '" up';
			})
		})
	}

	onMoveLayerDown() {
		this.setState({
			levelHistory: addHistory(this.state.levelHistory, level => {
				if (this.state.selectedLayerIndex === level.layers.length - 1) return false;
				let layer = level.layers[this.state.selectedLayerIndex];
				shiftDown(level.layers, this.state.selectedLayerIndex);
				this.setState({
					selectedLayerIndex: this.state.selectedLayerIndex + 1,
				});
				return 'Move layer "' + layer.name + '" down';
			})
		})
	}

	onDeleteLayer() {
		this.setState({
			levelHistory: addHistory(this.state.levelHistory, level => {
				if (level.layers.length <= 1) return false;
				let layer = level.layers[this.state.selectedLayerIndex];
				level.layers.splice(this.state.selectedLayerIndex, 1);
				this.setState({
					selectedLayerIndex: Math.min(this.state.selectedLayerIndex, level.layers.length - 1),
				});
				return 'Delete layer "' + layer.name + '"';
			})
		})
	}

	onPlace(x: number, y: number) {
		this.onRemove(x, y);
		this.setState({
			continuedAction: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				let layer = level.layers[this.state.selectedLayerIndex];
				layer.items = layer.items.filter(tile => !(tile.x === x && tile.y === y));
				if (isTileLayer(layer))
					layer.items.push({
						x: x,
						y: y,
						tileX: this.state.selectedTileX,
						tileY: this.state.selectedTileY
					});
				else
					layer.items.push({x: x, y: y});
				return 'Place tiles';
			}, this.state.continuedAction)
		})
	}

	onRemove(x: number, y: number) {
		this.setState({
			continuedAction: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				let layer = level.layers[this.state.selectedLayerIndex];
				layer.items = layer.items.filter(tile => !(tile.x === x && tile.y === y));
				return 'Remove tiles';
			}, this.state.continuedAction)
		})
	}

	render() {
		let level = getCurrentHistoryState(this.state.levelHistory);
		let selectedLayer = level.layers[this.state.selectedLayerIndex];
		return <Container fluid style={{paddingTop: '1em'}}>
			<Row>
				<Col md={3} style={{height: '90vh', overflowY: 'auto'}}>
					<LevelOptions
						level={level}
						onChangeLevelWidth={this.onChangeLevelWidth.bind(this)}
						onChangeLevelHeight={this.onChangeLevelHeight.bind(this)}
						onBlur={() => this.setState({continuedAction: false})}
					/>
					<LayerList
						project={this.props.project}
						level={level}
						selectedLayerIndex={this.state.selectedLayerIndex}
						showSelectedLayerOnTop={this.state.showSelectedLayerOnTop}
						onToggleShowSelectedLayerOnTop={() => this.setState({
							showSelectedLayerOnTop: !this.state.showSelectedLayerOnTop,
						})}
						onSelectLayer={(layerIndex: number) => this.setState({selectedLayerIndex: layerIndex})}
						onAddGeometryLayer={this.onAddGeometryLayer.bind(this)}
						onAddTileLayer={this.onAddTileLayer.bind(this)}
						onToggleLayerVisibility={this.onToggleLayerVisibility.bind(this)}
					/>
					<LayerOptions
						layer={selectedLayer}
						canMoveLayerUp={this.state.selectedLayerIndex > 0}
						canMoveLayerDown={this.state.selectedLayerIndex < level.layers.length - 1}
						canDeleteLayer={level.layers.length > 1}
						onChangeLayerName={this.onChangeLayerName.bind(this)}
						onMoveLayerUp={this.onMoveLayerUp.bind(this)}
						onMoveLayerDown={this.onMoveLayerDown.bind(this)}
						onDeleteLayer={this.onDeleteLayer.bind(this)}
						onBlur={() => this.setState({continuedAction: false})}
					/>
					{isTileLayer(selectedLayer) && <TilePicker
						project={this.props.project}
						tilesetName={this.props.project.tilesets[selectedLayer.tilesetIndex].name}
						tilesetImageData={this.state.resources.tilesetImages[selectedLayer.tilesetIndex]}
						selectedTileX={this.state.selectedTileX}
						selectedTileY={this.state.selectedTileY}
						onSelectTile={(x, y) => {
							this.setState({
								selectedTileX: x,
								selectedTileY: y,
							});
						}}
					/>}
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
				<Col md={9} style={{height: '90vh', overflowY: 'auto'}}>
					<Grid
						tileSize={this.props.project.tileSize}
						width={level.width}
						height={level.height}
						onPlace={this.onPlace.bind(this)}
						onRemove={this.onRemove.bind(this)}
						onMouseUp={() => this.setState({continuedAction: false})}
					>
						{level.layers.map((layer, i) => {
							if (!layer.visible) return '';
							let order = level.layers.length - i;
							if (this.state.showSelectedLayerOnTop && i === this.state.selectedLayerIndex)
								order = level.layers.length;
							if (isTileLayer(layer))
								return <TileLayerDisplay
									key={i}
									project={this.props.project}
									level={level}
									layer={layer}
									tilesetImageData={this.state.resources.tilesetImages[layer.tilesetIndex]}
									order={order}
								/>
							else if (layer.type === LayerType.Geometry)
								return <GeometryLayerDisplay
									key={i}
									project={this.props.project}
									level={level}
									layer={layer}
									order={order}
								/>
							return '';
						})}
					</Grid>
				</Col>
			</Row>
		</Container>;
	}
}
