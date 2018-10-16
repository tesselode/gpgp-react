import React from 'react';
import {
	Navbar,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	Label,
	ButtonGroup,
	Button,
	TabPane,
	TabContent,
} from 'reactstrap';
import Project from '../data/Project';
import ProjectSettingsEditor from './ProjectSettingsEditor';
import ProjectTilesetsEditor from './ProjectTilesetsEditor';
import { ProjectResources, TilesetImage, loadProjectResources } from '../data/ProjectResources';
import Tileset from '../data/Tileset';
import { remote } from 'electron';
import path from 'path';
import fs from 'fs';

export enum ProjectEditorTab {
	Settings,
	Tilesets,
}

export interface State {
	project: Project;
	resources: ProjectResources;
	projectFilePath?: string;
	activeTab: ProjectEditorTab;
	selectedTilesetIndex: number;
}

export default class ProjectEditor extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			project: {
				name: 'New project',
				tileSize: 16,
				defaultMapWidth: 16,
				defaultMapHeight: 9,
				maxMapWidth: 1000,
				maxMapHeight: 1000,
				tilesets: [],
			},
			resources: {
				tilesetImages: new Map<Tileset, TilesetImage>(),
			},
			selectedTilesetIndex: 0,
			activeTab: ProjectEditorTab.Settings,
		};
	}

	onChangeProjectName(name: string) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.name = name;
		this.setState({project: project});
	}

	onChangeTileSize(tileSize: number) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.tileSize = tileSize;
		this.setState({project: project});
	}

	onChangeDefaultMapWidth(defaultMapWidth: number) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.defaultMapWidth = defaultMapWidth;
		this.setState({project: project});
	}

	onChangeDefaultMapHeight(defaultMapHeight: number) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.defaultMapHeight = defaultMapHeight;
		this.setState({project: project});
	}

	onChangeMaxMapWidth(maxMapWidth: number) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.maxMapWidth = maxMapWidth;
		this.setState({project: project});
	}

	onChangeMaxMapHeight(maxMapHeight: number) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.maxMapHeight = maxMapHeight;
		this.setState({project: project});
	}

	onAddTileset() {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.tilesets.push({
			name: 'New tileset',
			imagePath: '',
		});
		this.setState({
			project: project,
			selectedTilesetIndex: Math.max(this.state.selectedTilesetIndex, 0),
		});
	}

	onRemoveTileset(tilesetIndex: number) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.tilesets.splice(tilesetIndex, 1);
		this.setState({
			project: project,
			selectedTilesetIndex: Math.min(this.state.selectedTilesetIndex, project.tilesets.length - 1),
		});
	}

	onMoveTilesetUp(tilesetIndex: number) {
		if (tilesetIndex === 0) return;
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		let above = project.tilesets[tilesetIndex - 1];
		let current = project.tilesets[tilesetIndex];
		project.tilesets[tilesetIndex - 1] = current;
		project.tilesets[tilesetIndex] = above;
		this.setState({
			project: project,
			selectedTilesetIndex: this.state.selectedTilesetIndex - 1,
		});
	}

	onMoveTilesetDown(tilesetIndex: number) {
		if (tilesetIndex === this.state.project.tilesets.length - 1) return;
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		let below = project.tilesets[tilesetIndex + 1];
		let current = project.tilesets[tilesetIndex];
		project.tilesets[tilesetIndex + 1] = current;
		project.tilesets[tilesetIndex] = below;
		this.setState({
			project: project,
			selectedTilesetIndex: this.state.selectedTilesetIndex + 1,
		});
	}

	onChangeTilesetName(tilesetIndex: number, name: string) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.tilesets[tilesetIndex].name = name;
		this.setState({project: project});
	}

	onChooseTilesetImage(tilesetIndex: number, imagePath: string) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.tilesets[tilesetIndex].imagePath = imagePath;
		this.setState({project: project});
		loadProjectResources(project)
			.then(resources => this.setState({resources: resources}))
	}

	save(saveAs = false) {
		let projectFilePath = this.state.projectFilePath;
		if (!projectFilePath || saveAs) {
			let chosenSaveLocation = remote.dialog.showSaveDialog({});
			if (!chosenSaveLocation) return;
			projectFilePath = chosenSaveLocation;
		}
		let project = JSON.parse(JSON.stringify(this.state.project));
		for (let i = 0; i < project.tilesets.length; i++) {
			const tileset = project.tilesets[i];
			tileset.imagePath = path.relative(path.dirname(projectFilePath), tileset.imagePath);
		}
		fs.writeFile(projectFilePath, JSON.stringify(project), (error) => {
			if (error) {
				remote.dialog.showErrorBox('Error saving project', 'The project could not be saved.');
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
			<Nav tabs>
				<NavItem>
					<NavLink
						active={this.state.activeTab === ProjectEditorTab.Settings}
						onClick={() => this.setState({activeTab: ProjectEditorTab.Settings})}
					>
						Settings
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						active={this.state.activeTab === ProjectEditorTab.Tilesets}
						onClick={() => this.setState({activeTab: ProjectEditorTab.Tilesets})}
					>
						Tilesets
					</NavLink>
				</NavItem>
			</Nav>
			<TabContent
				activeTab={this.state.activeTab}
				style={{padding: '1em'}}
			>
				<TabPane tabId={ProjectEditorTab.Settings}>
					<ProjectSettingsEditor
						project={this.state.project}
						onChangeProjectName={this.onChangeProjectName.bind(this)}
						onChangeTileSize={this.onChangeTileSize.bind(this)}
						onChangeDefaultMapWidth={this.onChangeDefaultMapWidth.bind(this)}
						onChangeDefaultMapHeight={this.onChangeDefaultMapHeight.bind(this)}
						onChangeMaxMapWidth={this.onChangeMaxMapWidth.bind(this)}
						onChangeMaxMapHeight={this.onChangeMaxMapHeight.bind(this)}
					/>
				</TabPane>
				<TabPane tabId={ProjectEditorTab.Tilesets}>
					<ProjectTilesetsEditor
						project={this.state.project}
						resources={this.state.resources}
						selectedTilesetIndex={this.state.selectedTilesetIndex}
						onAddTileset={this.onAddTileset.bind(this)}
						onRemoveTileset={this.onRemoveTileset.bind(this)}
						onMoveTilesetDown={this.onMoveTilesetDown.bind(this)}
						onMoveTilesetUp={this.onMoveTilesetUp.bind(this)}
						onChangeTilesetName={this.onChangeTilesetName.bind(this)}
						onSelectTileset={tilesetIndex => this.setState({selectedTilesetIndex: tilesetIndex})}
						onChooseTilesetImage={this.onChooseTilesetImage.bind(this)}
					/>
				</TabPane>
			</TabContent>
		</div>;
	}
}
