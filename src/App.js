import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import LayerList from './ui/LayerList';
import Editor from './editor/Editor';
import TilePicker from './ui/TilePicker';

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
						tileset: 'main',
					},
					{
						type: 'geometry',
						name: 'Geometry',
						data: [],
					},
				],
			},
			selectedLayer: 0,
		};
	}

	onPlace(x, y) {
		switch (this.state.level.layers[this.state.selectedLayer].type) {
			case 'geometry':
				let level = JSON.parse(JSON.stringify(this.state.level));
				let layer = level.layers[this.state.selectedLayer];
				layer.data.push({x: x, y: y});
				this.setState({level: level});
				break;
			default:
				break;
		}
	}

	onRemove(x, y) {
		switch (this.state.level.layers[this.state.selectedLayer].type) {
			case 'geometry':
				let level = JSON.parse(JSON.stringify(this.state.level));
				let layer = level.layers[this.state.selectedLayer];
				for (let i = 0; i < layer.data.length; i++) {
					const tile = layer.data[i];
					if (tile.x === x && tile.y === y) {
						layer.data.splice(i, 1);
					}
				}
				this.setState({level: level});
			default:
				break;
		}
	}

	render() {
		let selectedLayer = this.state.level.layers[this.state.selectedLayer];

		return (
			<Container fluid style={{padding: '1em'}}>
				<Row>
					<Col xs='3'>
						<LayerList
							layers={this.state.level.layers}
							selectedLayer={this.state.selectedLayer}
							onSelectLayer={(i) => this.setState({selectedLayer: i})}
						/>
						{selectedLayer.type == 'tile' ?
							<TilePicker
								project={this.state.project}
								tileset={selectedLayer.tileset}
							/>
						: ''}
					</Col>
					<Col xs='9'>
						<Editor
							project={this.state.project}
							width='67vw'
							height='90vh'
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
