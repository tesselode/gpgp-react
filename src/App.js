import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import LayerList from './ui/LayerList';
import Editor from './editor/Editor';

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
		let level = JSON.parse(JSON.stringify(this.state.level));
		let layer = level.layers[this.state.selectedLayer];
		layer.data.push({x: x, y: y});
		this.setState({level: level});
	}

	onRemove(x, y) {
		let level = JSON.parse(JSON.stringify(this.state.level));
		let layer = level.layers[this.state.selectedLayer];
		for (let i = 0; i < layer.data.length; i++) {
			const tile = layer.data[i];
			if (tile.x === x && tile.y === y) {
				layer.data.splice(i, 1);
			}
		}
		this.setState({level: level});
	}

	render() {
		return (
			<Container fluid style={{padding: '1em'}}>
				<Row>
					<Col xs='3'>
						<LayerList
							layers={this.state.level.layers}
							selectedLayer={this.state.selectedLayer}
							onSelectLayer={(i) => this.setState({selectedLayer: i})}
						/>
					</Col>
					<Col xs='9'>
						<Editor
							level={this.state.level}
							project={this.state.project}
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
