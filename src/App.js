import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import LayerList from './ui/LayerList';
import Editor from './editor/Editor';
import TilePicker from './ui/TilePicker';
import LevelProperties from './ui/LevelProperties';

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
					},
					{
						type: 'geometry',
						name: 'Geometry',
						data: [],
					},
				],
			},
			selectedLayerIndex: 0,
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

	onPlace(x, y) {
		switch (this.state.level.layers[this.state.selectedLayerIndex].type) {
			case 'geometry':
				let level = JSON.parse(JSON.stringify(this.state.level));
				let layer = level.layers[this.state.selectedLayerIndex];
				layer.data.push({x: x, y: y});
				this.setState({level: level});
				break;
			default:
				break;
		}
	}

	onRemove(x, y) {
		switch (this.state.level.layers[this.state.selectedLayerIndex].type) {
			case 'geometry':
				let level = JSON.parse(JSON.stringify(this.state.level));
				let layer = level.layers[this.state.selectedLayerIndex];
				for (let i = 0; i < layer.data.length; i++) {
					const tile = layer.data[i];
					if (tile.x === x && tile.y === y) {
						layer.data.splice(i, 1);
					}
				}
				this.setState({level: level});
				break;
			default:
				break;
		}
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
							/>
						: ''}
					</Col>
					<Col xs='9' style={{height: '95vh', overflowY: 'auto'}}>
						<Editor
							project={this.state.project}
							mapWidth={this.state.level.width}
							mapHeight={this.state.level.height}
							layers={this.state.level.layers}
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
