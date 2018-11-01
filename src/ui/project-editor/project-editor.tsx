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
import { newEntity, EntityParameterType } from '../../data/entity';
import Image, { loadImage, loadImages } from '../../data/image-data';
import Project, { exportProject, getProjectImagePaths, newProject } from '../../data/project';
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
			images: new Map<string, Image>(),
			projectFilePath: this.props.projectFilePath,
			selectedTilesetIndex: 0,
			activeTab: ProjectEditorTab.Settings,
		};
		if (this.props.project)
			loadImages(getProjectImagePaths(this.props.project)).then(images => {
				this.setState({images});
			});
	}

	private updateTabTitle() {
		this.props.onChangeTabTitle(this.state.project.name + (this.state.unsavedChanges ? '*' : ''));
	}

	private modifyProject(f: (project: Project) => void): void {
		const project = deepCopyObject(this.state.project);
		f(project);
		this.setState({
			project,
			unsavedChanges: true,
		}, () => {this.updateTabTitle(); });
	}

	private onChangeProjectName(name: string) {
		this.modifyProject(project => {project.name = name; });
	}

	private onChangeTileSize(tileSize: number) {
		this.modifyProject(project => {project.tileSize = tileSize; });
	}

	private onChangeDefaultMapWidth(defaultMapWidth: number) {
		this.modifyProject(project => {project.defaultMapWidth = defaultMapWidth; });
	}

	private onChangeDefaultMapHeight(defaultMapHeight: number) {
		this.modifyProject(project => {project.defaultMapHeight = defaultMapHeight; });
	}

	private onChangeMaxMapWidth(maxMapWidth: number) {
		this.modifyProject(project => {project.maxMapWidth = maxMapWidth; });
	}

	private onChangeMaxMapHeight(maxMapHeight: number) {
		this.modifyProject(project => {project.maxMapHeight = maxMapHeight; });
	}

	private onAddTileset() {
		this.modifyProject(project => {project.tilesets.push(newTileset()); });
		this.setState({
			selectedTilesetIndex: Math.max(this.state.selectedTilesetIndex, 0),
		});
	}

	private onRemoveTileset(tilesetIndex: number) {
		this.modifyProject(project => {project.tilesets.splice(tilesetIndex, 1); });
		this.setState({
			selectedTilesetIndex: Math.min(this.state.selectedTilesetIndex, this.state.project.tilesets.length - 2),
		});
	}

	private onMoveTilesetUp(tilesetIndex: number) {
		if (tilesetIndex === 0) return;
		this.modifyProject(project => {shiftUp(project.tilesets, tilesetIndex); });
		this.setState({
			selectedTilesetIndex: this.state.selectedTilesetIndex - 1,
		});
	}

	private onMoveTilesetDown(tilesetIndex: number) {
		if (tilesetIndex === this.state.project.tilesets.length - 1) return;
		this.modifyProject(project => {shiftDown(project.tilesets, tilesetIndex); });
		this.setState({
			selectedTilesetIndex: this.state.selectedTilesetIndex + 1,
		});
	}

	private onChangeTilesetName(tilesetIndex: number, name: string) {
		this.modifyProject(project => {project.tilesets[tilesetIndex].name = name; });
	}

	private onChooseTilesetImage(tilesetIndex: number, imagePath: string) {
		this.modifyProject(project => {project.tilesets[tilesetIndex].imagePath = imagePath; });
		loadImage(imagePath).then(image => {
			const images = new Map<string, Image>(this.state.images);
			images.set(imagePath, image);
			this.setState({images});
		});
	}

	private onAddEntity() {
		this.modifyProject(project => {project.entities.push(newEntity()); });
	}

	private onRemoveEntity(entityIndex: number) {
		this.modifyProject(project => {project.entities.splice(entityIndex, 1); });
	}

	private onMoveEntityUp(entityIndex: number) {
		if (entityIndex === 0) return;
		this.modifyProject(project => {shiftUp(project.entities, entityIndex); });
	}

	private onMoveEntityDown(entityIndex: number) {
		if (entityIndex === this.state.project.entities.length - 1) return;
		this.modifyProject(project => {shiftDown(project.entities, entityIndex); });
	}

	private onChangeEntityName(entityIndex: number, name: string) {
		this.modifyProject(project => {project.entities[entityIndex].name = name; });
	}

	private onChangeEntityColor(entityIndex: number, color: string) {
		this.modifyProject(project => {project.entities[entityIndex].color = color; });
	}

	private onChangeEntityWidth(entityIndex: number, width: number) {
		this.modifyProject(project => {project.entities[entityIndex].width = width; });
	}

	private onChangeEntityHeight(entityIndex: number, height: number) {
		this.modifyProject(project => {project.entities[entityIndex].height = height; });
	}

	private onChooseEntityImage(entityIndex: number, imagePath: string) {
		this.modifyProject(project => {project.entities[entityIndex].imagePath = imagePath; });
		loadImage(imagePath).then(image => {
			const images = new Map<string, Image>(this.state.images);
			images.set(imagePath, image);
			this.setState({images});
		});
	}

	private onAddEntityParameter(entityIndex: number) {
		this.modifyProject(project => {project.entities[entityIndex].parameters.push({
			name: 'New parameter',
			type: EntityParameterType.Number,
		}); });
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
						images={this.state.images}
						selectedTilesetIndex={this.state.selectedTilesetIndex}
						onSelectTileset={tilesetIndex => this.setState({selectedTilesetIndex: tilesetIndex})}
						onAddTileset={this.onAddTileset.bind(this)}
						onRemoveTileset={this.onRemoveTileset.bind(this)}
						onMoveTilesetDown={this.onMoveTilesetDown.bind(this)}
						onMoveTilesetUp={this.onMoveTilesetUp.bind(this)}
						onChangeTilesetName={this.onChangeTilesetName.bind(this)}
						onChooseTilesetImage={this.onChooseTilesetImage.bind(this)}
					/>
				</TabPane>
				<TabPane tabId={ProjectEditorTab.Entities}>
					<ProjectEntitiesEditor
						focused={this.state.activeTab === ProjectEditorTab.Entities}
						project={this.state.project}
						images={this.state.images}
						onAddEntity={this.onAddEntity.bind(this)}
						onRemoveEntity={this.onRemoveEntity.bind(this)}
						onMoveEntityDown={this.onMoveEntityDown.bind(this)}
						onMoveEntityUp={this.onMoveEntityUp.bind(this)}
						onChangeEntityName={this.onChangeEntityName.bind(this)}
						onChangeEntityColor={this.onChangeEntityColor.bind(this)}
						onChangeEntityWidth={this.onChangeEntityWidth.bind(this)}
						onChangeEntityHeight={this.onChangeEntityHeight.bind(this)}
						onChooseEntityImage={this.onChooseEntityImage.bind(this)}
						onAddEntityParameter={this.onAddEntityParameter.bind(this)}
					/>
				</TabPane>
			</TabContent>
		</div>;
	}
}
