import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import HistoryList, { addHistory, changeHistoryPosition, getCurrentHistoryState } from '../../data/history-list';
import { isGeometryLayer, newGeometryLayer, placeGeometry, removeGeometry } from '../../data/layer/geometry-layer';
import Layer, { LayerType } from '../../data/layer/Layer';
import { isTileLayer, newTileLayer, placeTile, removeTile } from '../../data/layer/tile-layer';
import Level, { exportLevel, newLevel } from '../../data/level';
import Project from '../../data/project';
import { loadProjectResources, newProjectResources, ProjectResources } from '../../data/project-resources';
import { Rect, shiftDown, shiftUp } from '../../util';
import AppTab from '../app-tab';
import GenericCursor, { CursorProps } from '../cursor/generic-cursor';
import TileCursor from '../cursor/tile-cursor';
import Grid, { GridTool } from '../grid';
import GeometryLayerDisplay from './layer/geometry-layer-display';
import TileLayerDisplay from './layer/tile-layer-display';
import HistoryBrowser from './sidebar/history-browser';
import LayerList from './sidebar/layer-list';
import LayerOptions from './sidebar/layer-options';
import LevelOptions from './sidebar/level-options';
import TilePicker from './sidebar/tile-picker';
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
	tilesetSelection?: Rect;
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
			continuedAction: false,
		};
		loadProjectResources(this.props.project).then(resources =>
			this.setState({resources}),
		);
	}

	public exit(onExit: () => void) {
		if (!this.state.unsavedChanges) {
			onExit();
			return;
		}
		const choice = remote.dialog.showMessageBox({
			type: 'warning',
			message: 'Do you want to save your changes?',
			buttons: ['Save', 'Don\'t save', 'Cancel'],
			defaultId: 0,
		});
		switch (choice) {
			case 0:
				this.save(false, () => {onExit(); });
				break;
			case 1:
				onExit();
				break;
		}
	}

	private updateTabTitle() {
		let tabTitle = this.state.levelFilePath ?
			path.parse(this.state.levelFilePath).name
			: 'New level';
		if (this.state.unsavedChanges) tabTitle += '*';
		this.props.onChangeTabTitle(tabTitle);
	}

	private onChangeLevelWidth(width: number) {
		this.setState({
			unsavedChanges: true,
			continuedAction: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				level.width = width;
				return 'Change level width';
			}, this.state.continuedAction),
		}, () => {this.updateTabTitle(); });
	}

	private onChangeLevelHeight(height: number) {
		this.setState({
			unsavedChanges: true,
			continuedAction: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				level.height = height;
				return 'Change level height';
			}, this.state.continuedAction),
		}, () => {this.updateTabTitle(); });
	}

	private onAddGeometryLayer() {
		this.setState({
			unsavedChanges: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				level.layers.splice(this.state.selectedLayerIndex, 0, newGeometryLayer());
				return 'Add geometry layer';
			}),
		}, () => {this.updateTabTitle(); });
	}

	private onAddTileLayer(tilesetIndex: number) {
		this.setState({
			unsavedChanges: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				level.layers.splice(this.state.selectedLayerIndex, 0, newTileLayer(tilesetIndex));
				return 'Add tile layer';
			}),
		}, () => {this.updateTabTitle(); });
	}

	private onToggleLayerVisibility(layerIndex: number) {
		this.setState({
			unsavedChanges: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				const layer = level.layers[layerIndex];
				layer.visible = !layer.visible;
				return layer.visible ? 'Show layer "' + layer.name + '"'
				: 'Hide layer "' + layer.name + '"';
			}),
		}, () => {this.updateTabTitle(); });
	}

	private onChangeLayerName(name: string) {
		this.setState({
			unsavedChanges: true,
			continuedAction: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				level.layers[this.state.selectedLayerIndex].name = name;
				return 'Rename layer to "' + name + '"';
			}, this.state.continuedAction),
		}, () => {this.updateTabTitle(); });
	}

	private onMoveLayerUp() {
		this.setState({
			unsavedChanges: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				if (this.state.selectedLayerIndex === 0) return false;
				const layer = level.layers[this.state.selectedLayerIndex];
				shiftUp(level.layers, this.state.selectedLayerIndex);
				this.setState({
					selectedLayerIndex: this.state.selectedLayerIndex - 1,
				});
				return 'Move layer "' + layer.name + '" up';
			}),
		}, () => {this.updateTabTitle(); });
	}

	private onMoveLayerDown() {
		this.setState({
			unsavedChanges: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				if (this.state.selectedLayerIndex === level.layers.length - 1) return false;
				const layer = level.layers[this.state.selectedLayerIndex];
				shiftDown(level.layers, this.state.selectedLayerIndex);
				this.setState({
					selectedLayerIndex: this.state.selectedLayerIndex + 1,
				});
				return 'Move layer "' + layer.name + '" down';
			}),
		}, () => {this.updateTabTitle(); });
	}

	private onDeleteLayer() {
		this.setState({
			unsavedChanges: true,
			levelHistory: addHistory(this.state.levelHistory, level => {
				if (level.layers.length <= 1) return false;
				const layer = level.layers[this.state.selectedLayerIndex];
				level.layers.splice(this.state.selectedLayerIndex, 1);
				this.setState({
					selectedLayerIndex: Math.min(this.state.selectedLayerIndex, level.layers.length - 1),
				});
				return 'Delete layer "' + layer.name + '"';
			}),
		}, () => {this.updateTabTitle(); });
	}

	private onPlace(rect: Rect) {
		this.setState({
			unsavedChanges: true,
			continuedAction: this.state.tool === GridTool.Pencil,
			levelHistory: addHistory(this.state.levelHistory, level => {
				const layer = level.layers[this.state.selectedLayerIndex];
				if (isGeometryLayer(layer))
					placeGeometry(layer, rect);
				else if (isTileLayer(layer) && this.state.tilesetSelection)
					placeTile(this.state.tool, layer, rect, this.state.tilesetSelection);
				return 'Place tiles';
			}, this.state.continuedAction),
		}, () => {this.updateTabTitle(); });
	}

	private onRemove(rect: Rect) {
		this.setState({
			unsavedChanges: true,
			continuedAction: this.state.tool === GridTool.Pencil,
			levelHistory: addHistory(this.state.levelHistory, level => {
				const layer = level.layers[this.state.selectedLayerIndex];
				if (isGeometryLayer(layer))
					removeGeometry(layer, rect);
				else if (isTileLayer(layer))
					removeTile(layer, rect);
				return 'Remove tiles';
			}, this.state.continuedAction),
		}, () => {this.updateTabTitle(); });
	}

	public save(saveAs = false, onSave?: () => void) {
		let levelFilePath = this.state.levelFilePath;
		if (!levelFilePath || saveAs) {
			const chosenSaveLocation = remote.dialog.showSaveDialog({
				filters: [
					{name: 'GPGP levels', extensions: ['gpgp']},
				],
			});
			if (!chosenSaveLocation) return;
			levelFilePath = chosenSaveLocation;
		}
		const level = exportLevel(getCurrentHistoryState(this.state.levelHistory), levelFilePath);
		fs.writeFile(levelFilePath, JSON.stringify(level), (error) => {
			if (error) {
				remote.dialog.showErrorBox('Error saving level', 'The level could not be saved.');
				return;
			}
			this.setState({
				unsavedChanges: false,
				levelFilePath,
			}, () => {this.updateTabTitle(); });
			if (onSave) onSave();
		});
	}

	private getCursor(layer: Layer): (props: CursorProps) => JSX.Element {
		if (isTileLayer(layer))
			return TileCursor({
				tool: this.state.tool,
				tilesetImage: this.state.resources.tilesetImages[layer.tilesetIndex],
				tilesetSelection: this.state.tilesetSelection,
			});
		return GenericCursor;
	}

	public render() {
		const level = getCurrentHistoryState(this.state.levelHistory);
		const selectedLayer = level.layers[this.state.selectedLayerIndex];
		return <Container fluid style={{paddingTop: '1em'}}>
			<Row>
				<Col md={3} style={{height: '90vh', overflowY: 'auto'}}>
					<ToolPalette
						tool={this.state.tool}
						onToolChanged={(tool) => this.setState({tool})}
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
						selection={this.state.tilesetSelection}
						onSelectTiles={(rect) => {this.setState({tilesetSelection: rect}); }}
					/>}
					<HistoryBrowser
						historyList={this.state.levelHistory}
						onHistoryPositionChanged={(position: number) => {
							this.setState({
								levelHistory: changeHistoryPosition(
									this.state.levelHistory,
									position,
								),
							});
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
								/>;
							else if (layer.type === LayerType.Geometry)
								return <GeometryLayerDisplay
									key={i}
									project={this.props.project}
									level={level}
									layer={layer}
									order={order}
								/>;
							return '';
						})}
					</Grid>
				</Col>
			</Row>
		</Container>;
	}
}
