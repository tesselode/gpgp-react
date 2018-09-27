import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import LayerList from './ui/LayerList';
import Editor from './editor/Editor';
import TilePicker from './ui/TilePicker';
import LevelProperties from './ui/LevelProperties';
import LayerProperties from './ui/LayerProperties';
import History from './ui/History';
const fs = window.require('fs');
const { ipcRenderer } = window.require('electron');
const { dialog } = window.require('electron').remote;

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			project: {
				tilesets: {
					main: {
						image: 'sheet.png',
						imageWidth: 272,
						imageHeight: 128,
						tileSize: 16,
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
			}],
			levelHistoryPosition: 0,
			levelFilePath: null,
			selectedLayerIndex: 0,
			selectedTileX: 0,
			selectedTileY: 0,
		};

		ipcRenderer.on('save', (event, saveAs) => this.save(saveAs));
		ipcRenderer.on('open', (event) => this.open());
		ipcRenderer.on('undo', (event) => this.undo());
		ipcRenderer.on('redo', (event) => this.redo());
	}

	getCurrentLevelState() {
		return this.state.levelHistory[this.state.levelHistoryPosition];
	}

	modifyLevel(f) {
		let level = JSON.parse(JSON.stringify(this.getCurrentLevelState()));
		f(level);
		let levelHistory = this.state.levelHistory.slice(0, this.state.levelHistoryPosition + 1);
		this.setState({
			levelHistory: levelHistory.concat(level),
			levelHistoryPosition: this.state.levelHistoryPosition + 1,
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
		})
	}

	onLevelHeightChanged(height) {
		this.modifyLevel((level) => {
			level.height = height;
		})
	}

	onLayerNameChanged(name) {
		this.modifyLevel((level) => {
			let layer = level.layers[this.state.selectedLayerIndex];
			layer.name = name;
		})
	}

	onLayerMovedUp() {
		if (this.state.selectedLayerIndex > 0) {
			this.modifyLevel((level) => {
				let above = level.layers[this.state.selectedLayerIndex - 1];
				let current = level.layers[this.state.selectedLayerIndex];
				level.layers[this.state.selectedLayerIndex - 1] = current;
				level.layers[this.state.selectedLayerIndex] = above;
			});
		}
	}

	onLayerMovedDown() {
		if (this.state.selectedLayerIndex < this.getCurrentLevelState().layers.length - 1) {
			this.modifyLevel((level) => {
				let below = level.layers[this.state.selectedLayerIndex + 1];
				let current = level.layers[this.state.selectedLayerIndex];
				level.layers[this.state.selectedLayerIndex + 1] = current;
				level.layers[this.state.selectedLayerIndex] = below;
			});
		}
	}

	onLayerDeleted() {
		if (this.getCurrentLevelState().layers.length > 1) {
			this.modifyLevel((level) => {
				level.layers.splice(this.state.selectedLayerIndex, 1);
			});
			this.setState({
				selectedLayerIndex: Math.min(this.state.selectedLayerIndex, this.getCurrentLevelState().layers.length - 1),
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
		})
	}

	onTileLayerAdded(tilesetName) {
		this.modifyLevel((level) => {
			level.layers.splice(this.state.selectedLayerIndex, 0, {
				type: 'tile',
				name: 'New Tile Layer',
				tilesetName: tilesetName,
				data: [],
			});
		})
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
		})
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
		})
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
						<LevelProperties
							level={this.getCurrentLevelState()}
							onLevelWidthChanged={(width) => this.onLevelWidthChanged(width)}
							onLevelHeightChanged={(height) => this.onLevelHeightChanged(height)}
						/>
						<LayerList
							layers={this.getCurrentLevelState().layers}
							tilesetNames={Object.keys(this.state.project.tilesets)}
							selectedLayer={this.state.selectedLayerIndex}
							onSelectLayer={(i) => this.setState({selectedLayerIndex: i})}
							onGeometryLayerAdded={() => this.onGeometryLayerAdded()}
							onTileLayerAdded={(tilesetName) => this.onTileLayerAdded(tilesetName)}
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
						/>
						{selectedLayer.type === 'tile' ?
							<TilePicker
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
						/>
					</Col>
					<Col xs='9' style={{height: '95vh', overflowY: 'auto'}}>
						<Editor
							project={this.state.project}
							mapWidth={this.getCurrentLevelState().width}
							mapHeight={this.getCurrentLevelState().height}
							layers={this.getCurrentLevelState().layers}
							selectedLayerIndex={this.state.selectedLayerIndex}
							onPlace={(x, y) => this.onPlace(x, y)}
							onRemove={(x, y) => this.onRemove(x, y)}
						/>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default App;
