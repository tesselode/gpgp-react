import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Level, { newLevel, exportLevel } from '../../data/level';
import HistoryList, { addHistory, getCurrentHistoryState, changeHistoryPosition } from '../../data/history-list';
import LevelOptions from './sidebar/level-options';
import LayerList from './sidebar/layer-list';
import HistoryBrowser from './sidebar/history-browser';
import Project from '../../data/project';
import { ProjectResources, loadProjectResources, newProjectResources } from '../../data/project-resources';
import { newGeometryLayer } from '../../data/layer/geometry-layer';
import { newTileLayer, isTileLayer } from '../../data/layer/tile-layer';
import Layer, { LayerType } from '../../data/layer/Layer';
import TilePicker from './sidebar/tile-picker';
import GeometryLayerDisplay from './layer/geometry-layer-display';
import Grid, { GridTool } from '../grid';
import TileLayerDisplay from './layer/tile-layer-display';
import LayerOptions from './sidebar/layer-options';
import { shiftUp, shiftDown } from '../../util';
import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import AppTab from '../app-tab';
import GenericCursor, { CursorProps } from '../cursor/generic-cursor';
import TileCursor from '../cursor/tile-cursor';
import ToolPalette from './sidebar/tool-palette';

export interface Props {
	focused: boolean;
	project: Project;
	projectFilePath: string;
	onChangeTabTitle: (title: string) => void;
	onCloseTab: () => void;
	level?: Level;
	levelFilePath?: string;
}

export interface State {
	resources: ProjectResources;
	levelHistory: HistoryList<Level>;
	unsavedChanges: boolean;
	levelFilePath?: string;
	tool: GridTool;
	showSelectedLayerOnTop: boolean;
	selectedLayerIndex: number;
	selectedTileX: number;
	selectedTileY: number;
	continuedAction: boolean;
}

export default class LevelEditor extends AppTab<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			resources: newProjectResources(),
			levelHistory: {
				position: 0,
				steps: [
					{
						description: this.props.level ? 'Open level' : 'New level',
						data: this.props.level ? this.props.level :
							newLevel(this.props.project, this.props.projectFilePath),
					},
				],
			},
			unsavedChanges: false,
			levelFilePath: this.props.levelFilePath,
			tool: GridTool.Pencil,
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

	exit(onExit: () => void) {
		if (!this.state.unsavedChanges) {
			onExit();
			return;
		}
		let choice = remote.dialog.showMessageBox({
			type: 'warning',
			message: 'Do you want to save your changes?',
			buttons: ['Save', 'Don\'t save', 'Cancel'],
			defaultId: 0,
		});
		switch (choice) {
			case 0:
				this.save(false, () => {onExit()});
				break;
			case 1:
				onExit();
				break;
		}
	}

	updateTabTitle() {
		let tabTitle = this.state.levelFilePath ?
			path.parse(this.state.levelFilePath).name
			: 'New level';
		if (this.state.unsavedChanges) tabTitle += '*';
		this.props.onChangeTabTitle(tabTitle);
	}

	onChangeLevelWidth(width: number) {
		this.setState({
			unsavedChanges: true,
			continuedAction: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				level.width = width;
				return 'Change level width';
			}, this.state.continuedAction)
		}, () => {this.updateTabTitle()});
	}

	onChangeLevelHeight(height: number) {
		this.setState({
			unsavedChanges: true,
			continuedAction: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				level.height = height;
				return 'Change level height';
			}, this.state.continuedAction)
		}, () => {this.updateTabTitle()});
	}

	onAddGeometryLayer() {
		this.setState({
			unsavedChanges: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				level.layers.splice(this.state.selectedLayerIndex, 0, newGeometryLayer())
				return 'Add geometry layer';
			})
		}, () => {this.updateTabTitle()})
	}

	onAddTileLayer(tilesetIndex: number) {
		this.setState({
			unsavedChanges: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				level.layers.splice(this.state.selectedLayerIndex, 0, newTileLayer(tilesetIndex))
				return 'Add tile layer';
			})
		}, () => {this.updateTabTitle()})
	}

	onToggleLayerVisibility(layerIndex: number) {
		this.setState({
			unsavedChanges: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				let layer = level.layers[layerIndex];
				layer.visible = !layer.visible;
				return layer.visible ? 'Show layer "' + layer.name + '"'
				: 'Hide layer "' + layer.name + '"'
			})
		}, () => {this.updateTabTitle()})
	}

	onChangeLayerName(name: string) {
		this.setState({
			unsavedChanges: true,
			continuedAction: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				level.layers[this.state.selectedLayerIndex].name = name;
				return 'Rename layer to "' + name + '"';
			}, this.state.continuedAction)
		}, () => {this.updateTabTitle()})
	}

	onMoveLayerUp() {
		this.setState({
			unsavedChanges: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				if (this.state.selectedLayerIndex === 0) return false;
				let layer = level.layers[this.state.selectedLayerIndex];
				shiftUp(level.layers, this.state.selectedLayerIndex);
				this.setState({
					selectedLayerIndex: this.state.selectedLayerIndex - 1,
				});
				return 'Move layer "' + layer.name + '" up';
			})
		}, () => {this.updateTabTitle()})
	}

	onMoveLayerDown() {
		this.setState({
			unsavedChanges: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				if (this.state.selectedLayerIndex === level.layers.length - 1) return false;
				let layer = level.layers[this.state.selectedLayerIndex];
				shiftDown(level.layers, this.state.selectedLayerIndex);
				this.setState({
					selectedLayerIndex: this.state.selectedLayerIndex + 1,
				});
				return 'Move layer "' + layer.name + '" down';
			})
		}, () => {this.updateTabTitle()})
	}

	onDeleteLayer() {
		this.setState({
			unsavedChanges: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				if (level.layers.length <= 1) return false;
				let layer = level.layers[this.state.selectedLayerIndex];
				level.layers.splice(this.state.selectedLayerIndex, 1);
				this.setState({
					selectedLayerIndex: Math.min(this.state.selectedLayerIndex, level.layers.length - 1),
				});
				return 'Delete layer "' + layer.name + '"';
			})
		}, () => {this.updateTabTitle()})
	}

	onPlace(x: number, y: number) {
		this.onRemove(x, y);
		this.setState({
			unsavedChanges: true,
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
		}, () => {this.updateTabTitle()})
	}

	onRemove(x: number, y: number) {
		this.setState({
			unsavedChanges: true,
			continuedAction: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				let layer = level.layers[this.state.selectedLayerIndex];
				layer.items = layer.items.filter(tile => !(tile.x === x && tile.y === y));
				return 'Remove tiles';
			}, this.state.continuedAction)
		}, () => {this.updateTabTitle()})
	}

	save(saveAs = false, onSave?: () => void) {
		let levelFilePath = this.state.levelFilePath;
		if (!levelFilePath || saveAs) {
			let chosenSaveLocation = remote.dialog.showSaveDialog({
				filters: [
					{name: 'GPGP levels', extensions: ['gpgp']},
				],
			});
			if (!chosenSaveLocation) return;
			levelFilePath = chosenSaveLocation;
		}
		let level = exportLevel(getCurrentHistoryState(this.state.levelHistory), levelFilePath);
		fs.writeFile(levelFilePath, JSON.stringify(level), (error) => {
			if (error) {
				remote.dialog.showErrorBox('Error saving level', 'The level could not be saved.');
				return;
			}
			this.setState({
				unsavedChanges: false,
				levelFilePath: levelFilePath,
			}, () => {this.updateTabTitle()});
			if (onSave) onSave();
		})
	}

	getCursor(layer: Layer): (props: CursorProps) => JSX.Element {
		if (isTileLayer(layer))
			return TileCursor({
				tilesetImage: this.state.resources.tilesetImages[layer.tilesetIndex],
				tileX: this.state.selectedTileX,
				tileY: this.state.selectedTileY,
			});
		return GenericCursor;
	}

	render() {
		let level = getCurrentHistoryState(this.state.levelHistory);
		let selectedLayer = level.layers[this.state.selectedLayerIndex];
		return <Container fluid style={{paddingTop: '1em'}}>
			<Row>
				<Col md={3} style={{height: '90vh', overflowY: 'auto'}}>
					<ToolPalette
						tool={this.state.tool}
						onToolChanged={(tool) => this.setState({tool: tool})}
					/>
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
						tool={this.state.tool}
						cursor={this.getCursor(selectedLayer)}
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
