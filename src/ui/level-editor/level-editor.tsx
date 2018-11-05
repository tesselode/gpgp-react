import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import Image, { loadImages } from '../../data/image-data';
import { isGeometryLayer, placeGeometry, removeGeometry } from '../../data/layer/geometry-layer';
import { isTileLayer, placeTile, removeTile } from '../../data/layer/tile-layer';
import Level, { exportLevel, newLevel } from '../../data/level';
import Project, { getProjectImagePaths } from '../../data/project';
import { deepCopyObject, normalizeRect, Rect } from '../../util';
import AppTab from '../app-tab';
import GenericCursor from '../cursor/generic-cursor';
import TileCursor from '../cursor/tile-cursor';
import Grid from '../grid';
import { EditTool } from './edit-tool';
import GeometryLayerDisplay from './layer/geometry-layer-display';
import TileLayerDisplay from './layer/tile-layer-display';
import HistoryBrowser from './sidebar/history-browser';
import LayerList from './sidebar/layer-list';
import LayerOptions from './sidebar/layer-options';
import LevelOptions from './sidebar/level-options';
import TilePicker from './sidebar/tile-picker';
import ToolPalette from './sidebar/tool-palette';

enum CursorState {
	Idle,
	Place,
	Remove,
}

interface Props {
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

interface State {
	/** The images for the level's project. */
	images: Map<string, Image>;
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
	tool: EditTool;
	/** Whether the currently selected layer should be shown above all other layers. */
	showSelectedLayerOnTop: boolean;
	/** The number of the currently selected layer. */
	selectedLayerIndex: number;
	/** The currently selected region of the tileset. */
	tilesetSelection?: Rect;
	/** Whether an action is currently taking place. */
	continuedAction: boolean;
	/** The last x position of the cursor. */
	cursorX: number;
	/** The last y position of the cursor. */
	cursorY: number;
	/** The current cursor rect. */
	cursorRect: Rect;
	/** The current cursor state. */
	cursorState: CursorState;
}

/** The level editor screen, which allows you to create or edit levels. */
export default class LevelEditor extends AppTab<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			images: new Map<string, Image>(),
			levelHistory: [
				this.props.level ? this.props.level :
					newLevel(this.props.project, this.props.projectFilePath),
			],
			levelHistoryDescriptions: [this.props.level ? 'Open level' : 'New level'],
			levelHistoryPosition: 0,
			unsavedChanges: false,
			levelFilePath: this.props.levelFilePath,
			tool: EditTool.Pencil,
			showSelectedLayerOnTop: true,
			selectedLayerIndex: 0,
			continuedAction: false,
			cursorX: 0,
			cursorY: 0,
			cursorRect: {l: 0, t: 0, r: 0, b: 0},
			cursorState: CursorState.Idle,
		};
		loadImages(getProjectImagePaths(this.props.project)).then(images => {
			this.setState({images});
		});
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

	private onMoveCursor(x: number, y: number): void {
		this.setState({cursorX: x, cursorY: y});
		switch (this.state.cursorState) {
			case CursorState.Idle:
				this.setState({cursorRect: {l: x, t: y, r: x, b: y}});
				break;
			case CursorState.Place:
			case CursorState.Remove:
				switch (this.state.tool) {
					case EditTool.Pencil:
						this.setState({cursorRect: {l: x, t: y, r: x, b: y}});
						switch (this.state.cursorState) {
							case CursorState.Place:
								this.onPlace({l: x, t: y, r: x, b: y});
								break;
							case CursorState.Remove:
								this.onRemove({l: x, t: y, r: x, b: y});
								break;
						}
						break;
					case EditTool.Rectangle:
						this.setState({cursorRect: {
							l: this.state.cursorRect.l,
							t: this.state.cursorRect.t,
							r: x,
							b: y,
						}});
				}
		}
	}

	private onClickGrid(button: number): void {
		switch (button) {
			case 0:
				this.setState({cursorState: CursorState.Place});
				if (this.state.tool === EditTool.Pencil)
					this.onPlace(normalizeRect(this.state.cursorRect));
				break;
			case 2:
				this.setState({cursorState: CursorState.Remove});
				if (this.state.tool === EditTool.Pencil)
					this.onRemove(normalizeRect(this.state.cursorRect));
				break;
		}
	}

	private onReleaseGrid(button: number): void {
		switch (this.state.tool) {
			case EditTool.Rectangle:
				switch (this.state.cursorState) {
					case CursorState.Place:
						this.onPlace(normalizeRect(this.state.cursorRect));
						break;
					case CursorState.Remove:
						this.onRemove(normalizeRect(this.state.cursorRect));
						break;
				}
				this.setState({cursorRect: {
					l: this.state.cursorX,
					t: this.state.cursorY,
					r: this.state.cursorX,
					b: this.state.cursorY,
				}});
				break;
		}
		this.setState({cursorState: CursorState.Idle});
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
						modifyLevel={this.modifyLevel.bind(this)}
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
						modifyLevel={this.modifyLevel.bind(this)}
					/>
					<LayerOptions
						level={level}
						selectedLayerIndex={this.state.selectedLayerIndex}
						modifyLevel={this.modifyLevel.bind(this)}
						onBlur={() => this.setState({continuedAction: false})}
					/>
					{isTileLayer(selectedLayer) && <TilePicker
						project={this.props.project}
						tilesetName={this.props.project.tilesets[selectedLayer.tilesetIndex].name}
						tilesetImageData={this.state.images.get(this.props.project.tilesets[selectedLayer.tilesetIndex].imagePath)}
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
						background={level.hasBackgroundColor && level.backgroundColor}
						onMove={this.onMoveCursor.bind(this)}
						onClick={this.onClickGrid.bind(this)}
						onRelease={this.onReleaseGrid.bind(this)}
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
									tilesetImageData={this.state.images.get(this.props.project.tilesets[layer.tilesetIndex].imagePath)}
									order={order}
								/>;
							else if (isGeometryLayer(layer))
								return <GeometryLayerDisplay
									key={i}
									project={this.props.project}
									level={level}
									layer={layer}
									order={order}
								/>;
							return '';
						})}
						{
							isTileLayer(selectedLayer) ? <TileCursor
								tileSize={this.props.project.tileSize}
								cursor={normalizeRect(this.state.cursorRect)}
								removing={this.state.cursorState === CursorState.Remove}
								tool={this.state.tool}
								tilesetImage={this.state.images.get(this.props.project.tilesets[selectedLayer.tilesetIndex].imagePath)}
								tilesetSelection={this.state.tilesetSelection}
							/> : <GenericCursor
								tileSize={this.props.project.tileSize}
								cursor={normalizeRect(this.state.cursorRect)}
								removing={this.state.cursorState === CursorState.Remove}
							/>
						}
					</Grid>
				</Col>
			</Row>
		</Container>;
	}
}
