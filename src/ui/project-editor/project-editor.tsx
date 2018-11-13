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
import Image, { loadImage } from '../../data/image-data';
import Project from '../../data/project';
import { deepCopyObject } from '../../util';
import AppTab from '../app-tab';
import ProjectSettingsTab from './project-settings-tab';
import ProjectTilesetsTab from './project-tilesets-tab';

export enum ProjectEditorTab {
	Settings,
	Tilesets,
}

export interface Props {
	/** The loaded project, if a project was opened. */
	project?: Project;
	/** The path to the project file, if a project was opened. */
	projectFilePath?: string;
	/** A function that is called when the tab title should be updated. */
	onChangeTabTitle: (title: string) => void;
	/** A function that is called when the "New level" button is pressed. */
	onCreateNewLevel: (project: Project, projectFilePath: string) => void;
}

export interface State {
	/** The current project. */
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
			project: this.props.project ? this.props.project : new Project(),
			unsavedChanges: false,
			images: new Map<string, Image>(),
			projectFilePath: this.props.projectFilePath,
			activeTab: ProjectEditorTab.Settings,
		};
		this.loadImages();
	}

	private updateTabTitle() {
		this.props.onChangeTabTitle(this.state.project.data.name + (this.state.unsavedChanges ? '*' : ''));
	}

	private loadImages() {
		for (const tileset of this.state.project.data.tilesets) {
			if (tileset.data.imagePath && !this.state.images.get(tileset.data.imagePath))
				loadImage(tileset.data.imagePath).then(image => {
					const images = new Map(this.state.images);
					images.set(tileset.data.imagePath, image);
					this.setState({images});
				});
		}
	}

	private setProject(project: Project) {
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
		const projectData = this.state.project.export(projectFilePath);
		fs.writeFile(projectFilePath, JSON.stringify(projectData), (error) => {
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
					{this.state.project.data.name}
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
					<ProjectSettingsTab
						project={this.state.project}
						setProject={this.setProject.bind(this)}
					/>
				</TabPane>
				<TabPane tabId={ProjectEditorTab.Tilesets}>
					<ProjectTilesetsTab
						focused={this.state.activeTab === ProjectEditorTab.Tilesets}
						project={this.state.project}
						images={this.state.images}
						setProject={this.setProject.bind(this)}
					/>
				</TabPane>
			</TabContent>
		</div>;
	}
}
