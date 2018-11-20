import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { Col, Container, Progress, Row } from 'reactstrap';
import { isNullOrUndefined } from 'util';
import HistoryList from '../../data/history-list';
import Image, { loadImage } from '../../data/image';
import EntityLayer from '../../data/layer/entity-layer';
import GeometryLayer from '../../data/layer/geometry-layer';
import TileLayer from '../../data/layer/tile-layer';
import Level from '../../data/level';
import Project from '../../data/project';
import { normalizeRect, Rect } from '../../util';
import AppTab from '../app-tab';
import EntityCursor from '../cursor/entity-cursor';
import GenericCursor from '../cursor/generic-cursor';
import TileCursor from '../cursor/tile-cursor';
import Grid from '../grid';
import { EditTool } from './edit-tool';
import EntityLayerDisplay from './layer/entity-layer-display';
import GeometryLayerDisplay from './layer/geometry-layer-display';
import TileLayerDisplay from './layer/tile-layer-display';
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
	/** Whether this tab currently has focus. */
	focused: boolean;
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
	/** The history of the level data. */
	levelHistory: HistoryList<Level>;
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
	/** The number of the currently selected entity. */
	selectedEntityIndex: number;
	/** The number of the currently selected entity layer item. */
	selectedEntityItemIndex?: number;
	/** The currently selected region of the tileset. */
	tilesetSelection?: Rect;
	/** Whether a level editing action is currently taking place
	 * (i.e., the user is currently placing tiles by dragging with the pencil tool).
	 */
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
			totalImages: 0,
			imagesLoaded: 0,
			levelHistory: HistoryList.New(
				this.props.level ? this.props.level :
					Level.New(this.props.project, this.props.projectFilePath),
				this.props.level ? 'Open level' : 'Create level',
			),
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
		};
		this.onKeyDown = this.onKeyDown.bind(this);
	}

	public componentDidMount() {
		window.addEventListener('keydown', this.onKeyDown);
		this.loadImages();
	}

	public componentWillUnmount() {
		window.removeEventListener('keydown', this.onKeyDown);
	}

	public onKeyDown(event: KeyboardEvent) {
		if (this.props.focused && event.key === 'Delete') this.onDelete();
	}

	private loadImages() {
		for (const imagePath of this.props.project.getImagePaths()) {
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

	private modifyLevel(level: Level, description: string, continuedAction?: boolean): void {
		this.setState({
			levelHistory: this.state.levelHistory.addState(level, description, this.state.continuedAction),
			continuedAction,
		}, () => {this.updateTabTitle(); });
	}

	private onMoveCursor(x: number, y: number): void {
		const level = this.state.levelHistory.getCurrentState();
		const layer = level.data.layers[this.state.selectedLayerIndex];
		if (layer instanceof EntityLayer) {
			switch (this.state.cursorState) {
				case CursorState.Place:
					if (!isNullOrUndefined(this.state.selectedEntityItemIndex)) {
						this.modifyLevel(
							level.setLayer(
								this.state.selectedLayerIndex,
								layer.move(
									this.state.selectedEntityItemIndex,
									x - this.state.cursorX,
									y - this.state.cursorY,
								),
							),
							'Move entity',
							true,
						);
					}
					break;
			}
		} else {
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
		this.setState({cursorX: x, cursorY: y});
	}

	private onClickGrid(button: number): void {
		const level = this.state.levelHistory.getCurrentState();
		const layer = level.data.layers[this.state.selectedLayerIndex];
		switch (button) {
			case 0:
				this.setState({cursorState: CursorState.Place});
				if (layer instanceof EntityLayer) {
					const itemIndex = layer.getItemAt(this.props.project, this.state.cursorX, this.state.cursorY);
					this.setState({selectedEntityItemIndex: itemIndex === -1 ? null : itemIndex});
				} else if (this.state.tool === EditTool.Pencil)
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
		this.setState({
			cursorState: CursorState.Idle,
			continuedAction: false,
		});
	}

	private onDoubleClickGrid(button: number) {
		const level = this.state.levelHistory.getCurrentState();
		const layer = level.data.layers[this.state.selectedLayerIndex];
		if (!(layer instanceof EntityLayer)) return;
		const entity = this.props.project.data.entities[this.state.selectedEntityIndex];
		switch (button) {
			case 0:
				this.modifyLevel(
					level.setLayer(
						this.state.selectedLayerIndex,
						layer.place(this.state.cursorX, this.state.cursorY, entity.data.name),
					),
					'Place entity',
				);
				break;
		}
	}

	private onPlace(rect: Rect) {
		const level = this.state.levelHistory.getCurrentState();
		const layer = level.data.layers[this.state.selectedLayerIndex];
		if (layer instanceof GeometryLayer)
			this.modifyLevel(
				level.setLayer(
					this.state.selectedLayerIndex,
					layer.place(rect),
				),
				'Place tiles',
				true,
			);
		else if (layer instanceof TileLayer && this.state.tilesetSelection)
			this.modifyLevel(
				level.setLayer(
					this.state.selectedLayerIndex,
					layer.place(this.state.tool, rect, this.state.tilesetSelection),
				),
				'Place tiles',
				true,
			);
	}

	private onRemove(rect: Rect) {
		const level = this.state.levelHistory.getCurrentState();
		const layer = level.data.layers[this.state.selectedLayerIndex];
		if (layer instanceof EntityLayer) return;
		this.modifyLevel(
			level.setLayer(
				this.state.selectedLayerIndex,
				layer.remove(rect),
			),
			'Remove tiles',
			true,
		);
	}

	private onDelete() {
		const level = this.state.levelHistory.getCurrentState();
		const layer = level.data.layers[this.state.selectedLayerIndex];
		if (!(layer instanceof EntityLayer && !isNullOrUndefined(this.state.selectedEntityItemIndex))) return;
		this.modifyLevel(
			level.setLayer(
				this.state.selectedLayerIndex,
				layer.remove(this.state.selectedEntityItemIndex),
			),
			'Remove entity',
		);
		this.setState({selectedEntityItemIndex: null});
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
		const level = this.state.levelHistory.getCurrentState();
		const levelData = JSON.stringify(level.export(levelFilePath));
		fs.writeFile(levelFilePath, levelData, (error) => {
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
		const level = this.state.levelHistory.getCurrentState();
		const selectedLayer = level.data.layers[this.state.selectedLayerIndex];

		if (this.state.imagesLoaded < this.state.totalImages) {
			return <Progress
				style={{transition: '0'}}
				value={(this.state.imagesLoaded / this.state.totalImages) * 100}
				animated
			/>;
		}

		return <Container fluid style={{paddingTop: '1em'}}>
			<Row>
				<Col md={3} style={{height: 'calc(100vh - 70px)', overflowY: 'auto'}}>
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
						onSelectLayer={(layerIndex: number) => this.setState({
							selectedLayerIndex: layerIndex,
							selectedEntityItemIndex: null,
						})}
						modifyLevel={this.modifyLevel.bind(this)}
					/>
					<LayerOptions
						level={level}
						project={this.props.project}
						selectedLayerIndex={this.state.selectedLayerIndex}
						modifyLevel={this.modifyLevel.bind(this)}
						onBlur={() => this.setState({continuedAction: false})}
					/>
					{selectedLayer instanceof TileLayer && <TilePicker
						project={this.props.project}
						tilesetName={selectedLayer.data.tilesetName}
						tilesetImageData={this.state.images.get(
							this.props.project.getTileset(selectedLayer.data.tilesetName).data.imagePath,
						)}
						onSelectTiles={(rect) => {this.setState({tilesetSelection: rect}); }}
					/>}
					{selectedLayer instanceof EntityLayer && <EntityPicker
						project={this.props.project}
						images={this.state.images}
						selectedEntityIndex={this.state.selectedEntityIndex}
						onSelectEntity={entityIndex => this.setState({selectedEntityIndex: entityIndex})}
					/>}
					<HistoryBrowser
						history={this.state.levelHistory}
						onJump={(position: number) => {
							this.setState({levelHistory: this.state.levelHistory.jump(position)});
						}}
					/>
				</Col>
				<Col md={9} style={{height: 'calc(100vh - 70px)', overflowY: 'auto'}}>
					<Grid
						tileSize={this.props.project.data.tileSize}
						width={level.data.width}
						height={level.data.height}
						background={level.data.hasBackgroundColor && level.data.backgroundColor}
						onMove={this.onMoveCursor.bind(this)}
						onClick={this.onClickGrid.bind(this)}
						onRelease={this.onReleaseGrid.bind(this)}
						onDoubleClick={this.onDoubleClickGrid.bind(this)}
					>
						{level.data.layers.map((layer, i) => {
							if (!layer.data.visible) return '';
							let order = -(i + 2);
							if (this.state.showSelectedLayerOnTop && i === this.state.selectedLayerIndex)
								order = -1;
							if (layer instanceof TileLayer)
								return <TileLayerDisplay
									key={i}
									project={this.props.project}
									level={level}
									layer={layer}
									tilesetImage={this.state.images.get(
										this.props.project.getTileset(layer.data.tilesetName).data.imagePath,
									)}
									order={order}
								/>;
							else if (layer instanceof EntityLayer)
								return <EntityLayerDisplay
									key={i}
									project={this.props.project}
									images={this.state.images}
									level={level}
									layer={layer}
									order={order}
									selectedEntityItemIndex={this.state.selectedEntityItemIndex}
								/>;
							else if (layer instanceof GeometryLayer)
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
							selectedLayer instanceof TileLayer ? <TileCursor
								tileSize={this.props.project.data.tileSize}
								cursor={normalizeRect(this.state.cursorRect)}
								removing={this.state.cursorState === CursorState.Remove}
								tool={this.state.tool}
								tilesetImage={this.state.images.get(
									this.props.project.getTileset(selectedLayer.data.tilesetName).data.imagePath,
								)}
								tilesetSelection={this.state.tilesetSelection}
							/> : selectedLayer instanceof EntityLayer ? <EntityCursor
								tileSize={this.props.project.data.tileSize}
								x={this.state.cursorX}
								y={this.state.cursorY}
								entity={this.props.project.data.entities[this.state.selectedEntityIndex]}
								images={this.state.images}
							/> : <GenericCursor
								tileSize={this.props.project.data.tileSize}
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
