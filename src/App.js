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
						data: [
							{x: 1, y: 4},
							{x: 2, y: 4},
							{x: 3, y: 5},
						],
					},
				],
			},
			selectedLayer: 0,
		};
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
						/>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default App;
