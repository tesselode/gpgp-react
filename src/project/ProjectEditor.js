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
	Label } from 'reactstrap';
import ProjectSettingsEditor from './ProjectSettingsEditor';
import TilesetsEditor from './TilesetsEditor';
const path = window.require('path');
const fs = window.require('fs');
const { dialog } = window.require('electron').remote;
const Jimp = window.require('jimp');

function validateLevelSize(value) {
	return !isNaN(value) && value > 0;
}

export default class ProjectEditor extends Component {
	constructor(props) {
		super(props);

		let project = props.project ? props.project : {
			name: 'New project',
			tileSize: 16,
			tilesets: [],
			defaultLevelWidth: 16,
			defaultLevelHeight: 9,
			maxLevelWidth: 1000,
			maxLevelHeight: 1000,
		};
		for (let i = 0; i < project.tilesets.length; i++) {
			const tileset = project.tilesets[i];
			tileset.imagePath = path.join(path.dirname(props.projectFilePath), tileset.imagePath);
			this.loadTilesetImage(i, tileset.imagePath);
		}

		this.state = {
			project: project,
			tilesetImages: [],
			activeTab: 'settings',
			projectFilePath: props.projectFilePath,
		};

		this.props.onChangeTabTitle(project.name);
	}

	onProjectNameChanged(name) {
		let project = JSON.parse(JSON.stringify(this.state.project));
		project.name = name;
		this.setState({project: project});	
	}

	onTileSizeChanged(tileSize) {
		let project = JSON.parse(JSON.stringify(this.state.project));
		if (validateLevelSize(tileSize)) project.tileSize = tileSize;
		this.setState({project: project});	
	}

	onDefaultLevelWidthChanged(width) {
		let project = JSON.parse(JSON.stringify(this.state.project));
		if (validateLevelSize(width)) project.defaultLevelWidth = width;
		this.setState({project: project});	
	}

	onDefaultLevelHeightChanged(height) {
		let project = JSON.parse(JSON.stringify(this.state.project));
		if (validateLevelSize(height)) project.defaultLevelHeight = height;
		this.setState({project: project});	
	}

	onMaxLevelWidthChanged(width) {
		let project = JSON.parse(JSON.stringify(this.state.project));
		if (validateLevelSize(width)) project.maxLevelWidth = width;
		this.setState({project: project});	
	}

	onMaxLevelHeightChanged(height) {
		let project = JSON.parse(JSON.stringify(this.state.project));
		if (validateLevelSize(height)) project.maxLevelHeight = height;
		this.setState({project: project});	
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

	loadTilesetImage(tilesetIndex, tilesetImagePath) {
		Jimp.read(tilesetImagePath, (error, image) => {
			if (error)
				dialog.showErrorBox('Error opening image', 'The image could not be opened.')
			else
				image.getBase64(Jimp.AUTO, (error, data) => {
					if (error)
						dialog.showErrorBox('Error reading image data', 'The image data could not be read.')
					else {						
						let tilesetImages = JSON.parse(JSON.stringify(this.state.tilesetImages));
						tilesetImages[tilesetIndex] = {
							data: data,
							width: image.bitmap.width,
							height: image.bitmap.height,
						};
						this.setState({tilesetImages: tilesetImages});
					}
				});
		});
	}

	onLocateTilesetImage(tilesetIndex) {
		let openPaths = dialog.showOpenDialog();
		if (openPaths) {
			let project = JSON.parse(JSON.stringify(this.state.project));
			this.loadTilesetImage(tilesetIndex, openPaths[0]);
			project.tilesets[tilesetIndex].imagePath = openPaths[0];
		}
	}

	save(saveAs) {
		let projectFilePath = this.state.projectFilePath;
		if (!projectFilePath || saveAs) {
			let chosenSaveLocation = dialog.showSaveDialog();
			if (!chosenSaveLocation) return;
			projectFilePath = chosenSaveLocation;
		}
		let project = JSON.parse(JSON.stringify(this.state.project));
		for (let i = 0; i < project.tilesets.length; i++) {
			const tileset = project.tilesets[i];
			tileset.imagePath = path.join(path.dirname(this.state.projectFilePath), tileset.imagePath);
		}
		fs.writeFile(projectFilePath, JSON.stringify(project), (error) => {
			if (error) {
				dialog.showErrorBox('Error saving project', 'The project was not saved successfully.');
				return;
			}
			this.setState({projectFilePath: projectFilePath});
		})			
	}

	render() {
		return <div>
			<Navbar>
				<NavbarBrand>
					{this.state.project.name}
					&nbsp;&nbsp;
					<Label size='sm' className='text-muted'>
						({this.state.projectFilePath ? this.state.projectFilePath : 'Unsaved'})
					</Label>
				</NavbarBrand>
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
					<ProjectSettingsEditor
						projectName={this.state.project.name}
						tileSize={this.state.project.tileSize}
						defaultLevelWidth={this.state.project.defaultLevelWidth}
						defaultLevelHeight={this.state.project.defaultLevelHeight}
						maxLevelWidth={this.state.project.maxLevelWidth}
						maxLevelHeight={this.state.project.maxLevelHeight}
						onProjectNameChanged={(name) => this.onProjectNameChanged(name)}
						onTileSizeChanged={(tileSize) => this.onTileSizeChanged(tileSize)}
						onDefaultLevelWidthChanged={(width) => this.onDefaultLevelWidthChanged(width)}
						onDefaultLevelHeightChanged={(height) => this.onDefaultLevelHeightChanged(height)}
						onMaxLevelWidthChanged={(width) => this.onMaxLevelWidthChanged(width)}
						onMaxLevelHeightChanged={(height) => this.onMaxLevelHeightChanged(height)}
						onChangeTabTitle={(title) => this.props.onChangeTabTitle(title)}
					/>
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
