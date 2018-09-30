import React, { Component } from 'react';
import {
	Nav,
	NavItem,
	NavLink,
	Navbar,
	NavbarBrand,
	Button,
	ButtonGroup,
	TabContent,
	TabPane,
	Form,
	FormGroup,
	Label,
	Input,
	Row,
	Col } from 'reactstrap';

export default class ProjectEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: 'settings',
		};
	}

	render() {
		return <div>
			<Navbar color='light'>
				<NavbarBrand>New project...</NavbarBrand>
				<ButtonGroup>
					<Button>Save project</Button>
					<Button>Save project as...</Button>
					<Button color='primary'>New level</Button>
				</ButtonGroup>
			</Navbar>
			<Nav tabs style={{padding: '1em', paddingBottom: '0'}}>
				<NavItem>
					<NavLink
						active={this.state.activeTab === 'settings'}
						onClick={() => this.setState({activeTab: 'settings'})}
					>
						Settings
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						active={this.state.activeTab === 'tilesets'}
						onClick={() => this.setState({activeTab: 'tilesets'})}
					>
						Tilesets
					</NavLink>
				</NavItem>
			</Nav>
			<TabContent activeTab={this.state.activeTab} style={{padding: '1em'}}>
				<TabPane tabId='settings'>
					<Form>
						<FormGroup row>
							<Label sm={2}>Default level width</Label>
							<Col sm={10}>
								<Input type='number'></Input>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={2}>Default level height</Label>
							<Col sm={10}>
								<Input type='number'></Input>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={2}>Max level width</Label>
							<Col sm={10}>
								<Input type='number'></Input>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={2}>Max level height</Label>
							<Col sm={10}>
								<Input type='number'></Input>
							</Col>
						</FormGroup>
					</Form>
				</TabPane>
				<TabPane tabId='tilesets'>
					hello!
				</TabPane>
			</TabContent>
		</div>
	}
}
