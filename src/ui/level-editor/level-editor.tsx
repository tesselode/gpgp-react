import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { isGeometryLayer, newGeometryLayer, placeGeometry, removeGeometry } from '../../data/layer/geometry-layer';
import { LayerType } from '../../data/layer/Layer';
import { isTileLayer, newTileLayer, placeTile, removeTile } from '../../data/layer/tile-layer';
import Level, { exportLevel, newLevel } from '../../data/level';
import Project from '../../data/project';
import { loadProjectResources, newProjectResources, ProjectResources } from '../../data/project-resources';
import { Rect, shiftDown, shiftUp, deepCopyObject } from '../../util';
import AppTab from '../app-tab';
import GenericCursor from '../cursor/generic-cursor';
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
	/** The project the currently edited level belongs to. */
	project: Project;
	/** The path to the project file. */
	projectFilePath: string;
	/** The loaded level data, if an existing level was opened. */
	level?: Level;
	/** The path to the level file, if an existing level was opened. */
	levelFilePath?: string;
	/** A function that is executed when the tab title should be updated. */
	onChangeTabTitle: (title: string) => void;
}

export interface State {
	/** The resources for the level's project. */
	resources: ProjectResources;
	/** The history of the level data. */
	levelHistory: Level[];
	/** The description of each state in the level history. */
	levelHistoryDescriptions: string[];
	/** The currently viewed position in the level history. */
	levelHistoryPosition: number;
	/** Whether there are unsaved changes to the level. */
	unsavedChanges: boolean;
	/** The path to the level file, if it has been saved or opened. */
	levelFilePath?: string;
	/** The currently used editing tool. */
	tool: GridTool;
	/** Whether the currently selected layer should be shown above all other layers. */
	showSelectedLayerOnTop: boolean;
	/** The number of the currently selected layer. */
	selectedLayerIndex: number;
	/** The currently selected region of the tileset. */
	tilesetSelection?: Rect;
	/** Whether an action is currently taking place. */
	continuedAction: boolean;
}

/** The level editor screen, which allows you to create or edit levels. */
export default class LevelEditor extends AppTab<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			resources: newProjectResources(),
			levelHistory: [
				this.props.level ? this.props.level :
					newLevel(this.props.project, this.props.projectFilePath),
			],
			levelHistoryDescriptions: [this.props.level ? 'Open level' : 'New level'],
			levelHistoryPosition: 0,
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

	private updateTabTitle() {
		let tabTitle = this.state.levelFilePath ?
			path.parse(this.state.levelFilePath).name
			: 'New level';
		if (this.state.unsavedChanges) tabTitle += '*';
		this.props.onChangeTabTitle(tabTitle);
	}

	private modifyLevel(f: (level: Level) => string | false, continuedAction?: boolean): void {
		let levelHistoryPosition = this.state.levelHistoryPosition;
		const levelHistory = this.state.levelHistory.slice(0, levelHistoryPosition + 1);
		const levelHistoryDescriptions = this.state.levelHistoryDescriptions.slice(
			0, this.state.levelHistoryPosition + 1);
		const newState = deepCopyObject(levelHistory[levelHistory.length - 1]);
		const description = f(newState);
		if (!description) return;
		if (this.state.continuedAction) {
			levelHistory[levelHistory.length - 1] = newState;
			levelHistoryDescriptions[levelHistoryDescriptions.length - 1] = description;
		} else {
			levelHistory.push(newState);
			levelHistoryDescriptions.push(description);
			levelHistoryPosition++;
		}
		this.setState({
			levelHistory,
			levelHistoryDescriptions,
			levelHistoryPosition,
			continuedAction,
			unsavedChanges: true,
		}, () => {this.updateTabTitle(); });
	}

	private getCurrentLevelState(): Level {
		return this.state.levelHistory[this.state.levelHistoryPosition];
	}

	private onChangeLevelWidth(width: number) {
		this.modifyLevel(level => {
			level.width = width;
			return 'Change level width';
		}, true);
	}

	private onChangeLevelHeight(height: number) {
		this.modifyLevel(level => {
			level.height = height;
			return 'Change level height';
		}, true);
	}

	private onAddGeometryLayer() {
		this.modifyLevel(level => {
			level.layers.splice(this.state.selectedLayerIndex, 0, newGeometryLayer());
			return 'Add geometry layer';
		});
	}

	private onAddTileLayer(tilesetIndex: number) {
		this.modifyLevel(level => {
			level.layers.splice(this.state.selectedLayerIndex, 0, newTileLayer(tilesetIndex));
			return 'Add tile layer';
		});
	}

	private onToggleLayerVisibility(layerIndex: number) {
		this.modifyLevel(level => {
			const layer = level.layers[layerIndex];
			layer.visible = !layer.visible;
			return layer.visible ? 'Show layer "' + layer.name + '"'
				: 'Hide layer "' + layer.name + '"';
		});
	}

	private onChangeLayerName(name: string) {
		this.modifyLevel(level => {
			level.layers[this.state.selectedLayerIndex].name = name;
			return 'Rename layer to "' + name + '"';
		}, true);
	}

	private onMoveLayerUp() {
		this.modifyLevel(level => {
			if (this.state.selectedLayerIndex === 0) return false;
			const layer = level.layers[this.state.selectedLayerIndex];
			shiftUp(level.layers, this.state.selectedLayerIndex);
			return 'Move layer "' + layer.name + '" up';
		});
		this.setState({
			selectedLayerIndex: this.state.selectedLayerIndex - 1,
		});
	}

	private onMoveLayerDown() {
		this.modifyLevel(level => {
			if (this.state.selectedLayerIndex === level.layers.length - 1) return false;
			const layer = level.layers[this.state.selectedLayerIndex];
			shiftDown(level.layers, this.state.selectedLayerIndex);
			this.setState({
				selectedLayerIndex: this.state.selectedLayerIndex + 1,
			});
			return 'Move layer "' + layer.name + '" down';
		});
	}

	private onDeleteLayer() {
		this.modifyLevel(level => {
			if (level.layers.length <= 1) return false;
			const layer = level.layers[this.state.selectedLayerIndex];
			level.layers.splice(this.state.selectedLayerIndex, 1);
			this.setState({
				selectedLayerIndex: Math.min(this.state.selectedLayerIndex, level.layers.length - 1),
			});
			return 'Delete layer "' + layer.name + '"';
		});
	}

	private onPlace(rect: Rect) {
		this.modifyLevel(level => {
			const layer = level.layers[this.state.selectedLayerIndex];
			if (isGeometryLayer(layer))
				placeGeometry(layer, rect);
			else if (isTileLayer(layer) && this.state.tilesetSelection)
				placeTile(this.state.tool, layer, rect, this.state.tilesetSelection);
			return 'Place tiles';
		}, true);
	}

	private onRemove(rect: Rect) {
		this.modifyLevel(level => {
			const layer = level.layers[this.state.selectedLayerIndex];
			if (isGeometryLayer(layer))
				removeGeometry(layer, rect);
			else if (isTileLayer(layer))
				removeTile(layer, rect);
			return 'Remove tiles';
		}, true);
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
		const level = exportLevel(this.getCurrentLevelState(), levelFilePath);
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

	public render() {
		const level = this.getCurrentLevelState();
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
						levelHistoryDescriptions={this.state.levelHistoryDescriptions}
						levelHistoryPosition={this.state.levelHistoryPosition}
						onHistoryPositionChanged={(position: number) => {
							this.setState({levelHistoryPosition: position});
						}}
					/>
				</Col>
				<Col md={9} style={{height: '90vh', overflowY: 'auto'}}>
					<Grid
						tileSize={this.props.project.tileSize}
						width={level.width}
						height={level.height}
						tool={this.state.tool}
						cursor={
							selectedLayer.type === LayerType.Tile ? TileCursor : GenericCursor
						}
						additionalCursorProps={
							isTileLayer(selectedLayer) && {
								tool: this.state.tool,
								tilesetImage: this.state.resources.tilesetImages[selectedLayer.tilesetIndex],
								tilesetSelection: this.state.tilesetSelection,
							}
						}
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
