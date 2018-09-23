import React, { Component } from 'react';
import { Container, Row, Col, Nav, NavItem, NavLink, TabPane, TabContent } from 'reactstrap';
import LayerList from './layers/LayerList';
import Grid from './grid/Grid';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeTab: '1',
		};
	}

	render() {
		return (
			<Container style={{padding: '1em'}}>
				<Row>
					<Col xs='3'>
						<Nav tabs>
							<NavItem>
								<NavLink
									active={this.state.activeTab === '1'}
									onClick={() => this.setState({activeTab: '1'})}
								>
									Layers
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									active={this.state.activeTab === '2'}
									onClick={() => this.setState({activeTab: '2'})}
								>
									Entities
								</NavLink>
							</NavItem>
						</Nav>
						<TabContent activeTab={this.state.activeTab}>
							<TabPane tabId='1'>
								<LayerList />
							</TabPane>
							<TabPane tabId='2'>
							</TabPane>
						</TabContent>
					</Col>
					<Col xs='9'>
						<Grid width={16} height={9} />
					</Col>
				</Row>
			</Container>
		);
	}
}

export default App;
