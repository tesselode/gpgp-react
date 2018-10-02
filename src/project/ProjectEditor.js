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
const fs = window.require('fs');
const { dialog } = window.require('electron').remote;

export default class ProjectEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			project: {
				tilesets: [],
			},
			tilesetImages: [],
			activeTab: 'settings',
		};
	}

	onTilesetAdded() {
		let project = JSON.parse(JSON.stringify(this.state.project));
		project.tilesets.push({
			name: 'New tileset',
			imagePath: '',
		})
		this.setState({project: project});
	}

	onTilesetRemoved(tilesetIndex) {
		if (this.state.project.tilesets.length === 0) return;
		let project = JSON.parse(JSON.stringify(this.state.project));
		project.tilesets.splice(tilesetIndex, 1);
		let tilesetImages = JSON.parse(JSON.stringify(this.state.tilesetImages));
		tilesetImages.splice(tilesetIndex, 1);
		this.setState({
			project: project,
			tilesetImages: tilesetImages,
		});
	}

	onTilesetNameChanged(tilesetIndex, name) {
		let project = JSON.parse(JSON.stringify(this.state.project));
		project.tilesets[tilesetIndex].name = name;
		this.setState({project: project})
	}

	onLocateTilesetImage(tilesetIndex) {
		let path = dialog.showOpenDialog()[0];
		if (path) {
			fs.readFile(path, 'base64', (error, data) => {
				if (error)
					dialog.showErrorBox('Error opening image', 'The image could not be opened.')
				else {
					let project = JSON.parse(JSON.stringify(this.state.project));
					project.tilesets[tilesetIndex].imagePath = path;
					let tilesetImages = JSON.parse(JSON.stringify(this.state.tilesetImages));
					tilesetImages[tilesetIndex] = 'data:image/png;base64,' + data;
					this.setState({
						project: project,
						tilesetImages: tilesetImages,
					});
				}
			});
		}
	}

	render() {
		return <div>
			<Navbar>
				<NavbarBrand>New project...</NavbarBrand>
				<ButtonGroup>
					<Button>Save project</Button>
					<Button>Save project as...</Button>
					<Button color='primary'>New level</Button>
				</ButtonGroup>
			</Navbar>
			<Nav tabs fill style={{padding: '1em', paddingBottom: '0'}}>
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
					<TilesetsEditor
						tilesets={this.state.project.tilesets}
						tilesetImages={this.state.tilesetImages}
						onTilesetAdded={() => this.onTilesetAdded()}
						onTilesetRemoved={(index) => this.onTilesetRemoved(index)}
						onTilesetNameChanged={(index, name) => this.onTilesetNameChanged(index, name)}
						onLocateTilesetImage={(index) => this.onLocateTilesetImage(index)}
					/>
				</TabPane>
			</TabContent>
		</div>
	}
}
