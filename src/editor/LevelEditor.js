import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import LayerList from '../sidebar/LayerList';
import Editor, { GridModes } from './Editor';
import TilePicker from '../sidebar/TilePicker';
import LevelProperties from '../sidebar/LevelProperties';
import LayerProperties from '../sidebar/LayerProperties';
import History from '../sidebar/History';
import EditorProperties from '../sidebar/EditorProperties';
const fs = window.require('fs');
const { ipcRenderer } = window.require('electron');
const { dialog } = window.require('electron').remote;

export default class LevelEditor extends Component {
	constructor(props) {
		super(props);

		this.state = {
			project: {
				tileSize: 16,
				tilesets: {
					main: {
						image: 'sheet.png',
						imageWidth: 272,
						imageHeight: 128,
					},
				},
			},
			levelHistory: [{
				width: 16,
				height: 9,
				layers: [
					{
						type: 'geometry',
						name: 'Geometry',
						data: [],
					},
				],
				description: 'New level',
			}],
			levelHistoryPosition: 0,
			finishedAction: true,
			levelFilePath: null,
			selectedLayerIndex: 0,
			selectedTileX: 0,
			selectedTileY: 0,
			gridMode: GridModes.OnTop,
			showSelectedLayerOnTop: true,
		};

		ipcRenderer.on('save', (event, saveAs) => this.save(saveAs));
		ipcRenderer.on('open', (event) => this.open());
		ipcRenderer.on('undo', (event) => this.undo());
		ipcRenderer.on('redo', (event) => this.redo());
	}

	getCurrentLevelState() {
		return this.state.levelHistory[this.state.levelHistoryPosition];
	}

	finishAction() {
		this.setState({finishedAction: true});
	}

	modifyLevel(f, unfinishedAction) {
		// create new level data
		let newLevelData = JSON.parse(JSON.stringify(this.getCurrentLevelState()));
		let description = f(newLevelData);
		newLevelData.description = description;

		// update the history
		let levelHistoryPosition = this.state.levelHistoryPosition;
		if (!this.state.finishedAction) levelHistoryPosition--;
		let levelHistory = this.state.levelHistory.slice(0, levelHistoryPosition + 1);
		this.setState({
			levelHistory: levelHistory.concat(newLevelData),
			levelHistoryPosition: levelHistoryPosition + 1,
			finishedAction: !unfinishedAction,
		});
	}

	undo() {
		if (this.state.levelHistoryPosition > 0)
			this.setState({levelHistoryPosition: this.state.levelHistoryPosition - 1});
	}

	redo() {
		if (this.state.levelHistoryPosition < this.state.levelHistory.length - 1)
			this.setState({levelHistoryPosition: this.state.levelHistoryPosition + 1});
	}

	onLevelWidthChanged(width) {
		this.modifyLevel((level) => {
			level.width = width;
			return 'Change level width to ' + width;
		}, true)
	}

	onLevelHeightChanged(height) {
		this.modifyLevel((level) => {
			level.height = height;
			return 'Change level height to ' + height;
		}, true)
	}

	onLayerNameChanged(name) {
		this.modifyLevel((level) => {
			let layer = level.layers[this.state.selectedLayerIndex];
			let oldName = layer.name;
			layer.name = name;
			return 'Rename "' + oldName + '" to "' + name + '"';
		}, true)
	}

	onLayerVisibilityToggled(layerIndex) {
		this.modifyLevel((level) => {
			let layer = level.layers[layerIndex];
			layer.hidden = !layer.hidden;
			return layer.hidden ? 'Hide layer "' + layer.name + '"' :
				'Show layer "' + layer.name + '"';
		})
	}

	onLayerMovedUp() {
		if (this.state.selectedLayerIndex > 0) {
			this.modifyLevel((level) => {
				let above = level.layers[this.state.selectedLayerIndex - 1];
				let current = level.layers[this.state.selectedLayerIndex];
				level.layers[this.state.selectedLayerIndex - 1] = current;
				level.layers[this.state.selectedLayerIndex] = above;
				return 'Move layer "' + current.name + '" up';
			});
			this.setState({selectedLayerIndex: this.state.selectedLayerIndex - 1});
		}
	}

	onLayerMovedDown() {
		if (this.state.selectedLayerIndex < this.getCurrentLevelState().layers.length - 1) {
			this.modifyLevel((level) => {
				let below = level.layers[this.state.selectedLayerIndex + 1];
				let current = level.layers[this.state.selectedLayerIndex];
				level.layers[this.state.selectedLayerIndex + 1] = current;
				level.layers[this.state.selectedLayerIndex] = below;
				return 'Move layer "' + current.name + '" down';
			});
			this.setState({selectedLayerIndex: this.state.selectedLayerIndex + 1});
		}
	}

	onLayerDeleted() {
		if (this.getCurrentLevelState().layers.length > 1) {
			this.modifyLevel((level) => {
				let layer = level.layers[this.state.selectedLayerIndex];
				level.layers.splice(this.state.selectedLayerIndex, 1);
				this.setState({
					selectedLayerIndex: Math.min(this.state.selectedLayerIndex, this.getCurrentLevelState().layers.length - 2),
				});
				return 'Delete layer "' + layer.name + '"';
			});
		}
	}

	onGeometryLayerAdded() {
		this.modifyLevel((level) => {
			level.layers.splice(this.state.selectedLayerIndex, 0, {
				type: 'geometry',
				name: 'New Geometry Layer',
				data: [],
			});
			return 'Add geometry layer';
		});
	}

	onTileLayerAdded(tilesetName) {
		this.modifyLevel((level) => {
			level.layers.splice(this.state.selectedLayerIndex, 0, {
				type: 'tile',
				name: 'New Tile Layer',
				tilesetName: tilesetName,
				data: [],
			});
			return 'Add tile layer';
		});
	}

	onTileSelected(x, y) {
		this.setState({
			selectedTileX: x,
			selectedTileY: y,
		});
	}

	onRemove(x, y) {
		this.modifyLevel((level) => {
			let layer = level.layers[this.state.selectedLayerIndex];
			layer.data = layer.data.filter((tile) => !(tile.x === x && tile.y === y));
			return 'Remove tiles from layer "' + layer.name + '"';
		}, true)
	}

	onPlace(x, y) {
		this.modifyLevel((level) => {
			let layer = level.layers[this.state.selectedLayerIndex];
			layer.data = layer.data.filter((tile) => !(tile.x === x && tile.y === y));
			switch (this.getCurrentLevelState().layers[this.state.selectedLayerIndex].type) {
				case 'geometry':
					layer.data.push({x: x, y: y});
					break;
				case 'tile':
					layer.data.push({
						x: x, 
						y: y,
						tileX: this.state.selectedTileX,
						tileY: this.state.selectedTileY,
					});
					break;
				default:
					break;
			}
			return 'Place tiles on layer "' + layer.name + '"';
		}, true)
	}

	open() {
		let path = dialog.showOpenDialog()[0];
		if (path) {
			fs.readFile(path, (error, data) => {
				if (error)
					dialog.showErrorBox('Error opening level', 'The level could not be opened.')
				else
					this.setState({
						levelHistory: [JSON.parse(data)],
						levelHistoryPosition: 0,
						levelFilePath: path,
					});
			})
		}
	}

	save(saveAs) {
		let path = this.state.levelFilePath;
		if (!path || saveAs) path = dialog.showSaveDialog();
		if (path)
			fs.writeFile(path, JSON.stringify(this.getCurrentLevelState()), (error) => {
				if (error)
					dialog.showErrorBox('Error saving level', 'The level was not saved successfully.')
				else
					this.setState({levelFilePath: path})
			});
	}

	render() {
		let selectedLayer = this.getCurrentLevelState().layers[this.state.selectedLayerIndex];

		return (
			<Container fluid style={{padding: '1em'}}>
				<Row>
					<Col xs='3' style={{height: '95vh', overflowY: 'auto'}}>
						<EditorProperties
							gridMode={this.state.gridMode}
							onGridModeChanged={(gridMode) => this.setState({gridMode: gridMode})}
							showSelectedLayerOnTop={this.state.showSelectedLayerOnTop}
							onToggle={() => this.setState({showSelectedLayerOnTop: !this.state.showSelectedLayerOnTop})}
						/>
						<LevelProperties
							level={this.getCurrentLevelState()}
							onLevelWidthChanged={(width) => this.onLevelWidthChanged(width)}
							onLevelHeightChanged={(height) => this.onLevelHeightChanged(height)}
							onInputBlurred={() => this.finishAction()}
						/>
						<LayerList
							layers={this.getCurrentLevelState().layers}
							tilesetNames={Object.keys(this.state.project.tilesets)}
							selectedLayer={this.state.selectedLayerIndex}
							onSelectLayer={(i) => this.setState({selectedLayerIndex: i})}
							onGeometryLayerAdded={() => this.onGeometryLayerAdded()}
							onTileLayerAdded={(tilesetName) => this.onTileLayerAdded(tilesetName)}
							onLayerVisibilityToggled={(layerIndex) => this.onLayerVisibilityToggled(layerIndex)}
						/>
						<LayerProperties
							layer={selectedLayer}
							allowMovingUp={this.state.selectedLayerIndex > 0}
							allowMovingDown={this.state.selectedLayerIndex < this.getCurrentLevelState().layers.length - 1}
							allowDeleting={this.getCurrentLevelState().layers.length > 1}
							onLayerNameChanged={(name) => this.onLayerNameChanged(name)}
							onLayerMovedUp={() => this.onLayerMovedUp()}
							onLayerMovedDown={() => this.onLayerMovedDown()}
							onLayerDeleted={() => this.onLayerDeleted()}
							onInputBlurred={() => this.finishAction()}
						/>
						{selectedLayer.type === 'tile' ?
							<TilePicker
								gridMode={this.state.gridMode}
								project={this.state.project}
								tilesetName={selectedLayer.tilesetName}
								tileset={this.state.project.tilesets[selectedLayer.tilesetName]}
								selectedTileX={this.state.selectedTileX}
								selectedTileY={this.state.selectedTileY}
								onTileSelected={(x, y) => this.onTileSelected(x, y)}
							/>
						: ''}
						<History
							history={this.state.levelHistory}
							historyPosition={this.state.levelHistoryPosition}
							onHistoryPositionChanged={(position) => this.setState({levelHistoryPosition: position})}
						/>
					</Col>
					<Col xs='9' style={{height: '95vh', overflowY: 'auto'}}>
						<Editor
							gridMode={this.state.gridMode}
							showSelectedLayerOnTop={this.state.showSelectedLayerOnTop}
							project={this.state.project}
							mapWidth={this.getCurrentLevelState().width}
							mapHeight={this.getCurrentLevelState().height}
							layers={this.getCurrentLevelState().layers}
							selectedLayerIndex={this.state.selectedLayerIndex}
							onPlace={(x, y) => this.onPlace(x, y)}
							onRemove={(x, y) => this.onRemove(x, y)}
							onMouseUp={() => this.finishAction()}
						/>
					</Col>
				</Row>
			</Container>
		);
	}
}
