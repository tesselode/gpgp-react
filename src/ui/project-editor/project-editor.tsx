import { remote } from 'electron';
import fs from 'fs';
import React from 'react';
import {
	Button,
	ButtonGroup,
	Label,
	Nav,
	Navbar,
	NavbarBrand,
	NavItem,
	NavLink,
	TabContent,
	TabPane,
} from 'reactstrap';
import Project, { exportProject, newProject } from '../../data/project';
import {
	loadProjectResources,
	loadTilesetImage,
	newProjectResources,
	ProjectResources,
	shallowCopyProjectResources,
} from '../../data/project-resources';
import { deepCopyObject, shiftDown, shiftUp } from '../../util';
import AppTab from '../app-tab';
import ProjectSettingsEditor from './project-settings-editor';
import ProjectTilesetsEditor from './project-tilesets-editor';

export enum ProjectEditorTab {
	Settings,
	Tilesets,
}

export interface Props {
	/** The loaded project data, if a project was opened. */
	project?: Project;
	/** The path to the project file, if a project was opened. */
	projectFilePath?: string;
	/** A function that is called when the tab title should be updated. */
	onChangeTabTitle: (title: string) => void;
	/** A function that is called when the "New level" button is pressed. */
	onCreateNewLevel: (project: Project, projectFilePath: string) => void;
}

export interface State {
	/** The current project data. */
	project: Project;
	/** Whether there are unsaved changes to the project. */
	unsavedChanges: boolean;
	/** The currently loaded resources for the project. */
	resources: ProjectResources;
	/** The path to the project file, if it is saved or opened. */
	projectFilePath?: string;
	/** The currently active project editor tab. */
	activeTab: ProjectEditorTab;
	/** The number of the currently selected tileset. */
	selectedTilesetIndex: number;
}

/** The project editor screen, which allows you to create new projects or edit existing ones. */
export default class ProjectEditor extends AppTab<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			project: this.props.project ? this.props.project : newProject(),
			unsavedChanges: false,
			resources: newProjectResources(),
			projectFilePath: this.props.projectFilePath,
			selectedTilesetIndex: 0,
			activeTab: ProjectEditorTab.Settings,
		};
		if (this.props.project)
			loadProjectResources(this.props.project).then(resources => {
				this.setState({
					resources,
				});
			});
	}

	public exit(onExit: () => void) {
		onExit();
	}

	private updateTabTitle() {
		this.props.onChangeTabTitle(this.state.project.name + (this.state.unsavedChanges ? '*' : ''));
	}

	private onChangeProjectName(name: string) {
		const project = deepCopyObject(this.state.project);
		project.name = name;
		this.setState({
			project,
			unsavedChanges: true,
		}, () => {this.updateTabTitle(); });
	}

	private onChangeTileSize(tileSize: number) {
		const project = deepCopyObject(this.state.project);
		project.tileSize = tileSize;
		this.setState({
			project,
			unsavedChanges: true,
		}, () => {this.updateTabTitle(); });
	}

	private onChangeDefaultMapWidth(defaultMapWidth: number) {
		const project = deepCopyObject(this.state.project);
		project.defaultMapWidth = defaultMapWidth;
		this.setState({
			project,
			unsavedChanges: true,
		}, () => {this.updateTabTitle(); });
	}

	private onChangeDefaultMapHeight(defaultMapHeight: number) {
		const project = deepCopyObject(this.state.project);
		project.defaultMapHeight = defaultMapHeight;
		this.setState({
			project,
			unsavedChanges: true,
		}, () => {this.updateTabTitle(); });
	}

	private onChangeMaxMapWidth(maxMapWidth: number) {
		const project = deepCopyObject(this.state.project);
		project.maxMapWidth = maxMapWidth;
		this.setState({
			project,
			unsavedChanges: true,
		}, () => {this.updateTabTitle(); });
	}

	private onChangeMaxMapHeight(maxMapHeight: number) {
		const project = deepCopyObject(this.state.project);
		project.maxMapHeight = maxMapHeight;
		this.setState({
			project,
			unsavedChanges: true,
		}, () => {this.updateTabTitle(); });
	}

	private onAddTileset() {
		const project = deepCopyObject(this.state.project);
		const resources = shallowCopyProjectResources(this.state.resources);
		project.tilesets.push({
			name: 'New tileset',
			imagePath: '',
		});
		resources.tilesetImages.push({});
		this.setState({
			project,
			unsavedChanges: true,
			resources,
			selectedTilesetIndex: Math.max(this.state.selectedTilesetIndex, 0),
		}, () => {this.updateTabTitle(); });
	}

	private onRemoveTileset(tilesetIndex: number) {
		const project = deepCopyObject(this.state.project);
		const resources = shallowCopyProjectResources(this.state.resources);
		project.tilesets.splice(tilesetIndex, 1);
		resources.tilesetImages.splice(tilesetIndex, 1);
		this.setState({
			project,
			unsavedChanges: true,
			resources,
			selectedTilesetIndex: Math.min(this.state.selectedTilesetIndex, project.tilesets.length - 1),
		}, () => {this.updateTabTitle(); });
	}

	private onMoveTilesetUp(tilesetIndex: number) {
		if (tilesetIndex === 0) return;
		const project = deepCopyObject(this.state.project);
		const resources = shallowCopyProjectResources(this.state.resources);
		shiftUp(project.tilesets, tilesetIndex);
		shiftUp(resources.tilesetImages, tilesetIndex);
		this.setState({
			project,
			unsavedChanges: true,
			resources,
			selectedTilesetIndex: this.state.selectedTilesetIndex - 1,
		}, () => {this.updateTabTitle(); });
	}

	private onMoveTilesetDown(tilesetIndex: number) {
		if (tilesetIndex === this.state.project.tilesets.length - 1) return;
		const project = deepCopyObject(this.state.project);
		const resources = shallowCopyProjectResources(this.state.resources);
		shiftDown(project.tilesets, tilesetIndex);
		shiftDown(resources.tilesetImages, tilesetIndex);
		this.setState({
			project,
			unsavedChanges: true,
			resources,
			selectedTilesetIndex: this.state.selectedTilesetIndex + 1,
		}, () => {this.updateTabTitle(); });
	}

	private onChangeTilesetName(tilesetIndex: number, name: string) {
		const project = deepCopyObject(this.state.project);
		project.tilesets[tilesetIndex].name = name;
		this.setState({
			project,
			unsavedChanges: true,
		}, () => {this.updateTabTitle(); });
	}

	private onChooseTilesetImage(tilesetIndex: number, imagePath: string) {
		const project = deepCopyObject(this.state.project);
		project.tilesets[tilesetIndex].imagePath = imagePath;
		this.setState({
			project,
			unsavedChanges: true,
		}, () => {this.updateTabTitle(); });
		const resources = shallowCopyProjectResources(this.state.resources);
		loadTilesetImage(imagePath).then(image => {
			resources.tilesetImages[tilesetIndex] = image;
			this.setState({resources});
		});
	}

	public save(saveAs = false) {
		let projectFilePath = this.state.projectFilePath;
		if (!projectFilePath || saveAs) {
			const chosenSaveLocation = remote.dialog.showSaveDialog({
				filters: [
					{name: 'GPGP projects', extensions: ['gpgpproj']},
				],
			});
			if (!chosenSaveLocation) return;
			projectFilePath = chosenSaveLocation;
		}
		const project = exportProject(this.state.project, projectFilePath);
		fs.writeFile(projectFilePath, JSON.stringify(project), (error) => {
			if (error) {
				remote.dialog.showErrorBox('Error saving project', 'The project could not be saved.');
				return;
			}
			this.setState({
				projectFilePath,
				unsavedChanges: false,
			}, () => {this.updateTabTitle(); });
		});
	}

	public render() {
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
					{this.state.projectFilePath ? <Button
						color='primary'
						disabled={this.state.unsavedChanges}
						onClick={() => this.props.onCreateNewLevel(this.state.project, this.state.projectFilePath)}
					>
						New level
					</Button> : ''}
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
						focused={this.state.activeTab === ProjectEditorTab.Tilesets}
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
