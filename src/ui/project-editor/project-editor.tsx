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
import { EntityParameterType, newEntity } from '../../data/entity';
import Image, { loadImage } from '../../data/image-data';
import Project, { exportProject, newProject } from '../../data/project';
import { newTileset } from '../../data/tileset';
import { deepCopyObject, shiftDown, shiftUp } from '../../util';
import AppTab from '../app-tab';
import ProjectEntitiesEditor from './project-entities-editor';
import ProjectSettingsEditor from './project-settings-editor';
import ProjectTilesetsEditor from './project-tilesets-editor';

export enum ProjectEditorTab {
	Settings,
	Tilesets,
	Entities,
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
	/** The currently loaded image data for the project. */
	images: Map<string, Image>;
	/** The path to the project file, if it is saved or opened. */
	projectFilePath?: string;
	/** The currently active project editor tab. */
	activeTab: ProjectEditorTab;
}

/** The project editor screen, which allows you to create new projects or edit existing ones. */
export default class ProjectEditor extends AppTab<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			project: this.props.project ? this.props.project : newProject(),
			unsavedChanges: false,
			images: new Map<string, Image>(),
			projectFilePath: this.props.projectFilePath,
			activeTab: ProjectEditorTab.Settings,
		};
		this.loadImages();
	}

	private updateTabTitle() {
		this.props.onChangeTabTitle(this.state.project.name + (this.state.unsavedChanges ? '*' : ''));
	}

	private loadImages() {
		for (const tileset of this.state.project.tilesets) {
			if (tileset.imagePath && !this.state.images.get(tileset.imagePath))
				loadImage(tileset.imagePath).then(image => {
					const images = new Map(this.state.images);
					images.set(tileset.imagePath, image);
					this.setState({images});
				});
		}
		for (const entity of this.state.project.entities) {
			if (entity.imagePath && !this.state.images.get(entity.imagePath))
				loadImage(entity.imagePath).then(image => {
					const images = new Map(this.state.images);
					images.set(entity.imagePath, image);
					this.setState({images});
				});
		}
	}

	private modifyProject(f: (project: Project) => void): void {
		const project = deepCopyObject(this.state.project);
		f(project);
		this.setState({
			project,
			unsavedChanges: true,
		}, () => {this.updateTabTitle(); });
		this.loadImages();
	}

	public exit(onExit: () => void) {
		onExit();
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
				<NavItem>
					<NavLink
						active={this.state.activeTab === ProjectEditorTab.Entities}
						onClick={() => this.setState({activeTab: ProjectEditorTab.Entities})}
					>
						Entities
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
						modifyProject={this.modifyProject.bind(this)}
					/>
				</TabPane>
				<TabPane tabId={ProjectEditorTab.Tilesets}>
					<ProjectTilesetsEditor
						focused={this.state.activeTab === ProjectEditorTab.Tilesets}
						project={this.state.project}
						images={this.state.images}
						modifyProject={this.modifyProject.bind(this)}
					/>
				</TabPane>
				<TabPane tabId={ProjectEditorTab.Entities}>
					<ProjectEntitiesEditor
						project={this.state.project}
						images={this.state.images}
						modifyProject={this.modifyProject.bind(this)}
					/>
				</TabPane>
			</TabContent>
		</div>;
	}
}
