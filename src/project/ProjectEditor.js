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
const path = window.require('path');
const fs = window.require('fs');
const { dialog } = window.require('electron').remote;
const Jimp = window.require('jimp');

export default class ProjectEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			project: {
				tileSize: 16,
				tilesets: [],
			},
			tilesetImages: [],
			activeTab: 'settings',
			projectFilePath: null,
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
		let openPaths = dialog.showOpenDialog();
		if (openPaths) {
			let tilesetImagePath = openPaths[0];
			Jimp.read(tilesetImagePath, (error, image) => {
				if (error)
					dialog.showErrorBox('Error opening image', 'The image could not be opened.')
				else
					image.getBase64(Jimp.AUTO, (error, data) => {
						if (error)
							dialog.showErrorBox('Error reading image data', 'The image data could not be read.')
						else {
							let project = JSON.parse(JSON.stringify(this.state.project));
							project.tilesets[tilesetIndex].imagePath = tilesetImagePath;
							let tilesetImages = JSON.parse(JSON.stringify(this.state.tilesetImages));
							tilesetImages[tilesetIndex] = {
								data: data,
								width: image.bitmap.width,
								height: image.bitmap.height,
							};
							this.setState({
								project: project,
								tilesetImages: tilesetImages,
							});
						}
					});
			});
		}
	}

	save(saveAs) {
		let projectFilePath = this.state.projectFilePath;
		if (!projectFilePath || saveAs) projectFilePath = dialog.showSaveDialog();
		if (projectFilePath) {
			let project = JSON.parse(JSON.stringify(this.state.project));
			for (let i = 0; i < project.tilesets.length; i++) {
				const tileset = project.tilesets[i];
				tileset.imagePath = path.relative(path.dirname(projectFilePath), tileset.imagePath);
			}
			fs.writeFile(projectFilePath, JSON.stringify(project), (error) => {
				if (error)
					dialog.showErrorBox('Error saving project', 'The project was not saved successfully.')
				else
					this.setState({projectFilePath: projectFilePath})
			});
		}
	}

	render() {
		return <div>
			<Navbar>
				<NavbarBrand>New project...</NavbarBrand>
				<ButtonGroup>
					{this.state.projectFilePath ? <Button
						onClick={() => this.save()}
					>
						Save project
					</Button> : ''}
					<Button
						color={!this.state.projectFilePath ? 'primary' : 'secondary'}
						onClick={() => this.save(true)}
					>
						Save project as...
					</Button>
					{this.state.projectFilePath ? <Button color='primary'>New level</Button> : ''}
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
						tileSize={this.state.project.tileSize}
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
