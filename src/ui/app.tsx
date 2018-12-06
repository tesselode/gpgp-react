import { ipcRenderer, remote } from 'electron';
import fs from 'fs';
import path from 'path';
import React from 'react';
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Nav,
	NavItem,
	NavLink,
	TabContent,
	TabPane,
} from 'reactstrap';
import Level, { ExportedLevelData } from '../data/level/level';
import Project, { ExportedProjectData } from '../data/project/project';
import LevelEditor from './level-editor/level-editor';
import ProjectEditor from './project-editor/project-editor';
import Welcome from './welcome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

enum TabType {
	ProjectEditor,
	LevelEditor,
}

interface ProjectEditorTab {
	type: TabType.ProjectEditor;
	ref: React.RefObject<ProjectEditor>;
	project?: Project;
	projectFilePath?: string;
}

interface LevelEditorTab {
	type: TabType.LevelEditor;
	ref: React.RefObject<LevelEditor>;
	project?: Project;
	projectFilePath?: string;
	level?: Level;
	levelFilePath?: string;
}

type Tab = ProjectEditorTab | LevelEditorTab;

interface State {
	activeTab: number;
	tabs: Tab[];
	tabTitles: string[];
	newTabDropdownOpen: boolean;
}

export default class App extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: 0,
			tabs: [],
			tabTitles: [],
			newTabDropdownOpen: false,
		};

		ipcRenderer.on('new project', event => this.onOpenProjectEditor());
		ipcRenderer.on('open project', event => this.onOpenProject());
		ipcRenderer.on('open level', event => this.onOpenLevel());
		ipcRenderer.on('close tab', event => this.onCloseTab(this.state.activeTab));
		ipcRenderer.on('undo', () => this.onUndo());
		ipcRenderer.on('redo', () => this.onRedo());
		ipcRenderer.on('save', (event, saveAs) => this.onSave(saveAs));
	}

	private onChangeTabTitle(tabIndex: number, title: string) {
		const tabTitles = this.state.tabTitles.slice(0, this.state.tabTitles.length);
		tabTitles[tabIndex] = title;
		this.setState({tabTitles});
	}

	private onOpenProject() {
		remote.dialog.showOpenDialog({
			filters: [
				{name: 'GPGP projects', extensions: ['gpgpproj']},
			],
			properties: ['multiSelections'],
		}, paths => {
			if (!paths) return;
			paths.forEach(path => {
				fs.readFile(path, (error, data) => {
					if (error) {
						remote.dialog.showErrorBox('Error opening project', 'The project could not be opened.');
						return;
					}
					const projectData: ExportedProjectData = JSON.parse(data.toString());
					this.onOpenProjectEditor(Project.Import(projectData, path), path);
				});
			});
		});
	}

	private onOpenProjectEditor(project?: Project, projectFilePath?: string) {
		const tabs = this.state.tabs.slice(0, this.state.tabs.length);
		const newTab: ProjectEditorTab = {
			type: TabType.ProjectEditor,
			ref: React.createRef<ProjectEditor>(),
			project,
			projectFilePath,
		};
		tabs.push(newTab);
		const tabTitles = this.state.tabTitles.slice(0, this.state.tabTitles.length);
		tabTitles.push(project ? project.data.name : 'New project');
		this.setState({tabs, tabTitles}, () => {
			this.setState({activeTab: this.state.tabs.length - 1});
		});
	}

	private onOpenLevel() {
		remote.dialog.showOpenDialog({
			filters: [
				{name: 'GPGP levels', extensions: ['gpgp']},
			],
			properties: ['multiSelections'],
		}, levelFilePaths => {
			if (!levelFilePaths) return;
			levelFilePaths.forEach(levelFilePath => {
				fs.readFile(levelFilePath, (error, data) => {
					if (error) {
						remote.dialog.showErrorBox('Error opening level', 'The level could not be opened.');
						return;
					}
					const levelData: ExportedLevelData = JSON.parse(data.toString());
					const projectFilePath = path.resolve(path.dirname(levelFilePath), levelData.projectFilePath);
					fs.readFile(projectFilePath, (error, data) => {
						if (error) {
							remote.dialog.showErrorBox('Error opening project', "The level's project file could not be opened.");
							return;
						}
						const project = Project.Import(JSON.parse(data.toString()), projectFilePath);
						const level = Level.Import(project, levelFilePath, levelData);
						this.onOpenLevelEditor(project, projectFilePath, level, levelFilePath);
					});
				});
			});
		});
	}

	private onOpenLevelEditor(project: Project, projectFilePath: string, level?: Level, levelFilePath?: string) {
		const tabs = this.state.tabs.slice(0, this.state.tabs.length);
		const newTab: LevelEditorTab = {
			type: TabType.LevelEditor,
			ref: React.createRef<LevelEditor>(),
			project,
			projectFilePath,
			level,
			levelFilePath,
		};
		tabs.push(newTab);
		const tabTitles = this.state.tabTitles.slice(0, this.state.tabTitles.length);
		tabTitles.push(levelFilePath ? path.parse(levelFilePath).name : 'New level');
		this.setState({tabs, tabTitles}, () => {
			this.setState({activeTab: this.state.tabs.length - 1});
		});
	}

	private onUndo() {
		const tab = this.state.tabs[this.state.activeTab];
		if (!(tab && tab.ref.current && tab.type === TabType.LevelEditor)) return;
		tab.ref.current.undo();
	}

	private onRedo() {
		const tab = this.state.tabs[this.state.activeTab];
		if (!(tab && tab.ref.current && tab.type === TabType.LevelEditor)) return;
		tab.ref.current.redo();
	}

	private onSave(saveAs?: boolean) {
		const tab = this.state.tabs[this.state.activeTab];
		if (!(tab && tab.ref.current)) return;
		tab.ref.current.save(saveAs);
	}

	private onCloseTab(tabNumber: number) {
		const tab = this.state.tabs[tabNumber];
		if (!(tab && tab.ref.current)) return;
		tab.ref.current.exit(() => {
			const tabs = this.state.tabs.slice(0, this.state.tabs.length);
			tabs.splice(tabNumber, 1);
			const tabTitles = this.state.tabTitles.slice(0, this.state.tabTitles.length);
			tabTitles.splice(tabNumber, 1);
			this.setState({tabs, tabTitles}, () => {
				this.setState({activeTab: Math.min(this.state.activeTab, this.state.tabs.length - 1)});
			});
		});
	}

	public render() {
		if (this.state.tabs.length === 0)
			return <Welcome
				onCreateNewProject={() => this.onOpenProjectEditor()}
				onOpenProject={() => this.onOpenProject()}
				onOpenLevel={() => this.onOpenLevel()}
			/>;
		return <div id='app'>
			<Nav tabs>
				{this.state.tabs.map((tab, i) => <NavItem key={i}>
					<NavLink
						active={this.state.activeTab === i}
						onClick={() => this.setState({activeTab: i})}
					>
						{this.state.tabTitles[i]}
						<Button
							close
							onClick={() => this.onCloseTab(i)}
							style={{
								paddingLeft: '.25em',
								marginTop: '-.1em',
							}}
						/>
					</NavLink>
				</NavItem>)}
				<NavItem>
					<Dropdown
						nav
						isOpen={this.state.newTabDropdownOpen}
						toggle={() => this.setState({newTabDropdownOpen: !this.state.newTabDropdownOpen})}
					>
						<DropdownToggle nav>
							<FontAwesomeIcon icon={faPlus} />
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem
								onClick={() => this.onOpenProjectEditor()}
							>
								New project...
							</DropdownItem>
							<DropdownItem
								onClick={() => this.onOpenProject()}
							>
								Open project...
							</DropdownItem>
							<DropdownItem
								onClick={() => this.onOpenLevel()}
							>
								Open level...
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</NavItem>
			</Nav>
			<TabContent activeTab={this.state.activeTab}>
				{this.state.tabs.map((tab, i) => <TabPane
					key={i}
					tabId={i}
				>
					{
						tab.type === TabType.ProjectEditor ? <ProjectEditor
							ref={tab.ref}
							project={tab.project}
							projectFilePath={tab.projectFilePath}
							onChangeTabTitle={title => {
								this.onChangeTabTitle(i, title);
							}}
							onCreateNewLevel={(project, projectFilePath) => this.onOpenLevelEditor(project, projectFilePath)}
						/> : tab.type === TabType.LevelEditor ? <LevelEditor
							ref={tab.ref}
							project={tab.project}
							projectFilePath={tab.projectFilePath}
							level={tab.level}
							levelFilePath={tab.levelFilePath}
							focused={this.state.activeTab === i}
							onChangeTabTitle={title => {
								this.onChangeTabTitle(i, title);
							}}
						/> : ''
					}
				</TabPane>)}
			</TabContent>
		</div>;
	}
}
