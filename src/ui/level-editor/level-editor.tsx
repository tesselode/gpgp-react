import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { Progress } from 'reactstrap';
import { isNullOrUndefined } from 'util';
import HistoryList from '../../data/history-list';
import Image, { loadImage } from '../../data/image';
import EntityLayer from '../../data/level/layer/entity-layer';
import GeometryLayer from '../../data/level/layer/geometry-layer';
import TileLayer from '../../data/level/layer/tile-layer';
import Level, { Layer } from '../../data/level/level';
import Project from '../../data/project/project';
import Rect from '../../data/rect';
import Stamp from '../../data/stamp';
import GridEditor, { GridEditorLayer } from '../common/grid-editor';
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
import ToolPalette from './sidebar/tool-palette';
import WarningsModal from './warnings-modal';
import GenericCursor from './cursor/generic-cursor';
import TilePicker from './sidebar/tile-picker';
import TileCursor from './cursor/tile-cursor';

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
	/** The current contents of the tile stamp. */
	tileStamp?: Stamp;
	/** The currently selected region in the tile picker. */
	tilePickerSelection?: Rect;
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
	/** Whether to hide the grid. */
	hideGrid: boolean;
}

/** The level editor screen, which allows you to create or edit levels. */
export default class LevelEditor extends React.Component<Props, State> {
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
			cursorRect: new Rect(0, 0),
			cursorState: CursorState.Idle,
			hideGrid: false,
		};
		this.onResize = this.onResize.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
	}

	public componentDidMount() {
		window.addEventListener('resize', this.onResize);
		window.addEventListener('keydown', this.onKeyDown);
		this.loadImages();
	}

	public componentWillUnmount() {
		window.removeEventListener('resize', this.onResize);
		window.removeEventListener('keydown', this.onKeyDown);
	}

	public onResize() {
		this.forceUpdate();
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
			unsavedChanges: true,
			continuedAction,
		}, () => {this.updateTabTitle(); });
	}

	private onSelectLayer(layerIndex: number) {
		const level = this.state.levelHistory.getCurrentState();
		const layer = level.data.layers[layerIndex];
		if (this.state.tool === EditTool.Stamp && !(layer instanceof TileLayer)) {
			this.setState({tool: EditTool.Pencil});
		}
		this.setState({
			selectedLayerIndex: layerIndex,
			selectedEntityItemIndex: null,
		});
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
					this.setState({cursorRect: new Rect(x, y)});
					break;
				case CursorState.Place:
				case CursorState.Remove:
					switch (this.state.tool) {
						case EditTool.Pencil:
							this.setState({cursorRect: new Rect(x, y)});
							switch (this.state.cursorState) {
								case CursorState.Place:
									this.onPlace(new Rect(x, y));
									break;
								case CursorState.Remove:
									this.onRemove(new Rect(x, y));
									break;
							}
							break;
						case EditTool.Rectangle:
						case EditTool.Stamp:
							this.setState({cursorRect: new Rect(
								this.state.cursorRect.l,
								this.state.cursorRect.t,
								x,
								y,
							)});
					}
			}
		}
		this.setState({cursorX: x, cursorY: y});
	}

	private onClickGrid(button: number): void {
		const level = this.state.levelHistory.getCurrentState();
		const layer = level.data.layers[this.state.selectedLayerIndex];
		switch (button) {
			case 0: // left mouse button
				this.setState({cursorState: CursorState.Place});
				if (layer instanceof EntityLayer) {
					const itemIndex = layer.getItemAt(this.props.project, this.state.cursorX, this.state.cursorY);
					this.setState({selectedEntityItemIndex: itemIndex === -1 ? null : itemIndex});
				} else if (this.state.tool === EditTool.Pencil)
					this.onPlace(this.state.cursorRect.normalized());
				break;
			case 2: // right mouse button
				this.setState({cursorState: CursorState.Remove});
				if (this.state.tool === EditTool.Pencil)
					this.onRemove(this.state.cursorRect.normalized());
				break;
		}
	}

	private onReleaseGrid(button: number): void {
		switch (this.state.tool) {
			case EditTool.Rectangle:
				switch (this.state.cursorState) {
					case CursorState.Place:
						this.onPlace(this.state.cursorRect.normalized());
						break;
					case CursorState.Remove:
						this.onRemove(this.state.cursorRect.normalized());
						break;
				}
				this.setState({cursorRect: new Rect(this.state.cursorX, this.state.cursorY)});
				break;
			case EditTool.Stamp:
				const level = this.state.levelHistory.getCurrentState();
				const selectedLayer = level.data.layers[this.state.selectedLayerIndex];
				if (selectedLayer instanceof TileLayer)
					this.setState({
						tileStamp: selectedLayer.createStampFromRect(this.state.cursorRect),
						tilePickerSelection: null,
						cursorRect: new Rect(this.state.cursorX, this.state.cursorY),
						tool: EditTool.Pencil,
					});
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
						layer.place(this.state.cursorX, this.state.cursorY, entity.data.name, this.props.project),
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
		else if (layer instanceof TileLayer && this.state.tileStamp)
			this.modifyLevel(
				level.setLayer(
					this.state.selectedLayerIndex,
					layer.place(this.state.tool, rect, this.state.tileStamp),
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

	public undo() {
		this.setState({levelHistory: this.state.levelHistory.undo()});
	}

	public redo() {
		this.setState({levelHistory: this.state.levelHistory.redo()});
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
		const levelData = JSON.stringify(level.export(levelFilePath), null, 4);
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

	private getLayerDisplay(layer: Layer): GridEditorLayer {
		return layer instanceof EntityLayer ? EntityLayerDisplay({
			project: this.props.project,
			images: this.state.images,
			layer,
		}) : layer instanceof TileLayer ? TileLayerDisplay({
			project: this.props.project,
			images: this.state.images,
			layer,
		}) : GeometryLayerDisplay({
			project: this.props.project,
			layer,
		});
	}

	private getCursorDisplay(): GridEditorLayer {
		const level = this.state.levelHistory.getCurrentState();
		const selectedLayer = level.data.layers[this.state.selectedLayerIndex];
		return selectedLayer instanceof TileLayer ? TileCursor({
			tileSize: this.props.project.data.tileSize,
			cursor: this.state.cursorRect.normalized(),
			removing: this.state.cursorState === CursorState.Remove,
			tool: this.state.tool,
			tilesetImage: this.state.images.get(this.props.project.getTileset(selectedLayer.data.tilesetName).data.imagePath),
			stamp: this.state.tileStamp,
		}) : GenericCursor({
			tileSize: this.props.project.data.tileSize,
			cursor: this.state.cursorRect.normalized(),
			removing: this.state.cursorState === CursorState.Remove,
		});
	}

	private getLayerDisplays(): GridEditorLayer[] {
		const level = this.state.levelHistory.getCurrentState();
		const selectedLayer = level.data.layers[this.state.selectedLayerIndex];
		const gridEditorLayers: GridEditorLayer[] = [];
		for (let i = level.data.layers.length - 1; i >= 0; i--) {
			const layer = level.data.layers[i];
			if (!layer.data.visible) continue;
			if (this.state.showSelectedLayerOnTop && this.state.selectedLayerIndex === i) continue;
			gridEditorLayers.push(this.getLayerDisplay(layer));
		}
		if (this.state.showSelectedLayerOnTop && selectedLayer.data.visible)
			gridEditorLayers.push(this.getLayerDisplay(selectedLayer));
		gridEditorLayers.push(this.getCursorDisplay());
		return gridEditorLayers;
	}

	public render() {
		if (this.state.imagesLoaded < this.state.totalImages) {
			return <Progress
				style={{transition: '0'}}
				value={(this.state.imagesLoaded / this.state.totalImages) * 100}
				animated
			/>;
		}

		const level = this.state.levelHistory.getCurrentState();
		const selectedLayer = level.data.layers[this.state.selectedLayerIndex];

		return <div>
			<WarningsModal warnings={level.getWarnings()} />
			<div
				style={{
					width: '350px',
					maxWidth: '75%',
					float: 'left',
					height: 'calc(100vh - 42px)',
					overflowY: 'auto',
					resize: 'horizontal',
					padding: '.5em',
					paddingTop: 0,
				}}
			>
				<ToolPalette
					isTileLayerSelected={selectedLayer instanceof TileLayer}
					tool={this.state.tool}
					hideGrid={this.state.hideGrid}
					onToolChanged={(tool) => this.setState({tool})}
					onToggleGrid={() => this.setState({hideGrid: !this.state.hideGrid})}
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
					onSelectLayer={this.onSelectLayer.bind(this)}
					modifyLevel={this.modifyLevel.bind(this)}
				/>
				<LayerOptions
					level={level}
					project={this.props.project}
					selectedLayerIndex={this.state.selectedLayerIndex}
					modifyLevel={this.modifyLevel.bind(this)}
					onBlur={() => this.setState({continuedAction: false})}
				/>
				<TilePicker
					project={this.props.project}
					images={this.state.images}
					layer={selectedLayer}
					sidebarWidth={350}
					onSelectTiles={(rect) => {this.setState({
						tilePickerSelection: rect,
						tileStamp: Stamp.FromRect(rect),
					}); }}
				/>
				<EntityPicker
					project={this.props.project}
					images={this.state.images}
					selectedEntityIndex={this.state.selectedEntityIndex}
					onSelectEntity={entityIndex => this.setState({selectedEntityIndex: entityIndex})}
				/>
				<EntityOptions
					project={this.props.project}
					level={level}
					selectedLayerIndex={this.state.selectedLayerIndex}
					selectedEntityItemIndex={this.state.selectedEntityItemIndex}
					modifyLevel={this.modifyLevel.bind(this)}
				/>
				<HistoryBrowser
					history={this.state.levelHistory}
					onJump={(position: number) => {
						this.setState({levelHistory: this.state.levelHistory.jump(position)});
					}}
				/>
			</div>
			<div
				style={{
					height: 'calc(100vh - 42px)',
					overflow: 'hidden',
				}}
			>
				<GridEditor
					viewportWidth={window.innerWidth - 350}
					viewportHeight={window.innerHeight - 42}
					tileSize={this.props.project.data.tileSize}
					width={level.data.width}
					height={level.data.height}
					layers={this.getLayerDisplays()}
					onMoveCursor={this.onMoveCursor.bind(this)}
					onClick={this.onClickGrid.bind(this)}
					onRelease={this.onReleaseGrid.bind(this)}
					onDoubleClick={this.onDoubleClickGrid.bind(this)}
				/>
			</div>
		</div>;
	}
}
