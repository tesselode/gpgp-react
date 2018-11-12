import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { Col, Container, Progress, Row } from 'reactstrap';
import Image, { loadImage } from '../../data/image-data';
import EntityLayer, { EntityLayerItem, getItemAt, isEntityLayer, placeEntity } from '../../data/layer/entity-layer';
import { isGeometryLayer, placeGeometry, removeGeometry } from '../../data/layer/geometry-layer';
import { LayerType } from '../../data/layer/layer';
import { isTileLayer, placeTile, removeTile } from '../../data/layer/tile-layer';
import Level, { exportLevel, newLevel } from '../../data/level';
import Project, { getProjectImagePaths, getProjectTileset } from '../../data/project';
import { deepCopyObject, normalizeRect, Rect } from '../../util';
import AppTab from '../app-tab';
import EntityCursor from '../cursor/entity-cursor';
import GenericCursor from '../cursor/generic-cursor';
import TileCursor from '../cursor/tile-cursor';
import Grid from '../grid';
import { EditTool } from './edit-tool';
import EntityLayerDisplay from './layer/entity-layer-display';
import GeometryLayerDisplay from './layer/geometry-layer-display';
import TileLayerDisplay from './layer/tile-layer-display';
import EntityOptions from './sidebar/entity-options';
import EntityPicker from './sidebar/entity-picker';
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
	/** The total numer of images that need to be loaded. */
	totalImages: number;
	/** The number of images that have been loaded so far. */
	imagesLoaded: number;
	/** Whether all the images have been loaded. */
	finishedLoading: boolean;
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
	/** The number of the currently selected entity. */
	selectedEntityIndex: number;
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
	/** The currently selected entity layer item. */
	selectedEntityItemIndex: number;
	/** The layer that the currently selected entity item is on. */
	selectedEntityItemLayer?: EntityLayer;
}

/** The level editor screen, which allows you to create or edit levels. */
export default class LevelEditor extends AppTab<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			images: new Map<string, Image>(),
			totalImages: 0,
			imagesLoaded: 0,
			finishedLoading: false,
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
			selectedEntityIndex: 0,
			continuedAction: false,
			cursorX: 0,
			cursorY: 0,
			cursorRect: {l: 0, t: 0, r: 0, b: 0},
			cursorState: CursorState.Idle,
			selectedEntityItemIndex: -1,
		};
	}

	public componentDidMount() {
		this.loadImages();
	}

	private loadImages() {
		for (const imagePath of getProjectImagePaths(this.props.project)) {
			this.setState({totalImages: this.state.totalImages + 1});
			loadImage(imagePath).then(image => {
				const images = new Map(this.state.images);
				images.set(imagePath, image);
				this.setState({
					images,
					imagesLoaded: this.state.imagesLoaded + 1,
				});
			});
		}
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
		const layer = this.getCurrentLevelState().layers[this.state.selectedLayerIndex];
		if (isEntityLayer(layer)) {
			const itemIndex = getItemAt(this.props.project, layer, this.state.cursorX, this.state.cursorY);
			this.setState({
				selectedEntityItemIndex: itemIndex,
				selectedEntityItemLayer: itemIndex !== -1 ? layer : null,
			});
		} else {
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
		this.setState({
			cursorState: CursorState.Idle,
			continuedAction: false,
		});
	}

	private onDoubleClick(button: number) {
		if (button !== 0) return;
		this.modifyLevel(level => {
			const layer = level.layers[this.state.selectedLayerIndex];
			if (!isEntityLayer(layer)) return false;
			placeEntity(layer, this.props.project.entities[this.state.selectedEntityIndex].name,
				this.state.cursorX, this.state.cursorY);
			return 'Place entity';
		});
	}

	private onPlace(rect: Rect) {
		this.modifyLevel(level => {
			const layer = level.layers[this.state.selectedLayerIndex];
			if (isGeometryLayer(layer))
				placeGeometry(layer, rect);
			else if (isTileLayer(layer)) {
				if (!this.state.tilesetSelection) return false;
				placeTile(this.state.tool, layer, rect, this.state.tilesetSelection);
			} else
				return false;
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

		if (this.state.imagesLoaded < this.state.totalImages) {
			return <Progress
				style={{transition: '0'}}
				value={(this.state.imagesLoaded / this.state.totalImages) * 100}
				animated
			/>;
		}

		return <Container fluid style={{paddingTop: '1em'}}>
			<Row>
				<Col md={3} style={{height: '90vh', overflowY: 'auto'}}>
					{!isEntityLayer(selectedLayer) && <ToolPalette
						tool={this.state.tool}
						onToolChanged={(tool) => this.setState({tool})}
					/>}
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
						project={this.props.project}
						selectedLayerIndex={this.state.selectedLayerIndex}
						modifyLevel={this.modifyLevel.bind(this)}
						onBlur={() => this.setState({continuedAction: false})}
					/>
					{isTileLayer(selectedLayer) && <TilePicker
						project={this.props.project}
						tilesetName={selectedLayer.tilesetName}
						tilesetImageData={this.state.images.get(
							getProjectTileset(this.props.project, selectedLayer.tilesetName).imagePath,
						)}
						onSelectTiles={(rect) => {this.setState({tilesetSelection: rect}); }}
					/>}
					{isEntityLayer(selectedLayer) && <EntityPicker
						project={this.props.project}
						images={this.state.images}
						selectedEntityIndex={this.state.selectedEntityIndex}
						onSelectEntity={entityIndex => this.setState({selectedEntityIndex: entityIndex})}
					/>}
					{this.state.selectedEntityItemIndex !== -1 && <EntityOptions
						project={this.props.project}
						layer={this.state.selectedEntityItemLayer}
						itemIndex={this.state.selectedEntityItemIndex}
						modifyLayer={(f, continuedAction) => {
							this.modifyLevel(level => {
								return f(this.state.selectedEntityItemLayer);
							}, continuedAction);
						}}
						onBlur={() => this.setState({continuedAction: false})}
					/>}
					<HistoryBrowser
						historyDescriptions={this.state.levelHistoryDescriptions}
						historyPosition={this.state.levelHistoryPosition}
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
						onDoubleClick={this.onDoubleClick.bind(this)}
					>
						{level.layers.map((layer, i) => {
							if (!layer.visible) return '';
							let order = -(i + 2);
							if (this.state.showSelectedLayerOnTop && i === this.state.selectedLayerIndex)
								order = -1;
							if (isTileLayer(layer))
								return <TileLayerDisplay
									key={i}
									project={this.props.project}
									level={level}
									layer={layer}
									tilesetImage={this.state.images.get(
										getProjectTileset(this.props.project, layer.tilesetName).imagePath,
									)}
									order={order}
								/>;
							else if (isEntityLayer(layer))
								return <EntityLayerDisplay
									key={i}
									project={this.props.project}
									images={this.state.images}
									level={level}
									layer={layer}
									order={order}
									selectedEntityItemIndex={this.state.selectedEntityItemIndex}
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
								tilesetImage={this.state.images.get(
									getProjectTileset(this.props.project, selectedLayer.tilesetName).imagePath,
								)}
								tilesetSelection={this.state.tilesetSelection}
							/> : isEntityLayer(selectedLayer) ? <EntityCursor
								tileSize={this.props.project.tileSize}
								x={this.state.cursorX}
								y={this.state.cursorY}
								entity={this.props.project.entities[this.state.selectedEntityIndex]}
								images={this.state.images}
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
