import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Level, { newLevel } from '../data/Level';
import HistoryList, { addHistory, getCurrentHistoryState, changeHistoryPosition } from '../data/HistoryList';
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
			selectedLayerIndex: 0,
			selectedTileX: 0,
			selectedTileY: 0,
			continuedAction: false,
		}
		loadProjectResources(this.props.project).then(resources =>
			this.setState({resources: resources})
		);
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
		return <Container fluid>
			<Row>
				<Col md={3}>
					<LayerList
						project={this.props.project}
						level={level}
						selectedLayerIndex={this.state.selectedLayerIndex}
						onSelectLayer={(layerIndex: number) => this.setState({selectedLayerIndex: layerIndex})}
						onAddGeometryLayer={this.onAddGeometryLayer.bind(this)}
						onAddTileLayer={this.onAddTileLayer.bind(this)}
						onToggleLayerVisibility={this.onToggleLayerVisibility.bind(this)}
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
				<Col md={9}>
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
							let order = level.layers.length - 1;
							if (i === this.state.selectedLayerIndex)
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
