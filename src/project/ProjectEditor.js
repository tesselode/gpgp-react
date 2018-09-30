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
	TabPane } from 'reactstrap';
import ProjectSettingsEditor from './ProjectSettingsEditor';
import TilesetsEditor from './TilesetsEditor';

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
					<ProjectSettingsEditor />
				</TabPane>
				<TabPane tabId='tilesets'>
					<TilesetsEditor />
				</TabPane>
			</TabContent>
		</div>
	}
}
