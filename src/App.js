import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import LayerList from './layers/LayerList';
import Grid from './grid/Grid';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			level: {
				width: 16,
				height: 9,
				layers: [
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

	render() {
		return (
			<Container style={{padding: '1em'}}>
				<Row>
					<Col xs='3'>
						<LayerList
							layers={this.state.level.layers}
							selectedLayer={this.state.selectedLayer}
						/>
					</Col>
					<Col xs='9'>
						<Grid
							level={this.state.level}
							onPlace={(x, y) => this.onPlace(x, y)}
						/>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default App;
