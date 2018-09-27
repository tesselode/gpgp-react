import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import LayerList from './ui/LayerList';
import Editor from './editor/Editor';
import TilePicker from './ui/TilePicker';
import LevelProperties from './ui/LevelProperties';
const fs = window.require('fs');
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
			level: {
				width: 16,
				height: 9,
				layers: [
					{
						type: 'tile',
						name: 'Main tiles',
						tilesetName: 'main',
						data: [],
					},
					{
						type: 'geometry',
						name: 'Geometry',
						data: [],
					},
				],
			},
			levelFilePath: null,
			selectedLayerIndex: 0,
			selectedTileX: 0,
			selectedTileY: 0,
		};
	}

	onLevelWidthChanged(width) {
		let level = JSON.parse(JSON.stringify(this.state.level));
		level.width = width;
		this.setState({level: level});
	}

	onLevelHeightChanged(height) {
		let level = JSON.parse(JSON.stringify(this.state.level));
		level.height = height;
		this.setState({level: level});
	}

	onTileSelected(x, y) {
		this.setState({
			selectedTileX: x,
			selectedTileY: y,
		});
	}

	onRemove(x, y) {
		let level = JSON.parse(JSON.stringify(this.state.level));
		let layer = level.layers[this.state.selectedLayerIndex];
		layer.data = layer.data.filter((tile) => !(tile.x === x && tile.y === y));
		this.setState({level: level});
	}

	onPlace(x, y) {
		let level = JSON.parse(JSON.stringify(this.state.level));
		let layer = level.layers[this.state.selectedLayerIndex];
		layer.data = layer.data.filter((tile) => !(tile.x === x && tile.y === y));
		switch (this.state.level.layers[this.state.selectedLayerIndex].type) {
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
		this.setState({level: level});
	}

	save(saveAs) {
		let path = this.state.levelFilePath;
		if (!path || saveAs) {
			path = dialog.showSaveDialog();
			this.setState({levelFilePath: path})
		}
		fs.writeFile(path, JSON.stringify(this.state.level), (error) => {
			if (error)
				dialog.showErrorBox('Error saving file', 'The file was not saved successfully.')
		});
	}

	render() {
		let selectedLayer = this.state.level.layers[this.state.selectedLayerIndex];

		return (
			<Container fluid style={{padding: '1em'}}>
				<Row>
					<Col xs='3' style={{height: '95vh', overflowY: 'auto'}}>
						<LevelProperties
							level={this.state.level}
							onLevelWidthChanged={(width) => this.onLevelWidthChanged(width)}
							onLevelHeightChanged={(height) => this.onLevelHeightChanged(height)}
						/>
						<LayerList
							layers={this.state.level.layers}
							selectedLayer={this.state.selectedLayerIndex}
							onSelectLayer={(i) => this.setState({selectedLayerIndex: i})}
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
						<Button onClick={() => this.save()}>Save</Button>
					</Col>
					<Col xs='9' style={{height: '95vh', overflowY: 'auto'}}>
						<Editor
							project={this.state.project}
							mapWidth={this.state.level.width}
							mapHeight={this.state.level.height}
							layers={this.state.level.layers}
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
