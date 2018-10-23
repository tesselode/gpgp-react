import React from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane, Button, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import LevelEditor from './level-editor/level-editor';
import ProjectEditor from './project-editor/project-editor';
import Welcome from './welcome';
import Project, { importProject } from '../data/Project';
import Octicon, { Plus } from '@githubprimer/octicons-react';
import { remote, ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';
import './app.css';
import Level, { importLevel } from '../data/Level';
import { deepCopyObject } from '../util';
import AppTab from './app-tab';

export enum TabType {
	ProjectEditor = 'ProjectEditor',
	LevelEditor = 'LevelEditor',
}

export interface Tab {
	type: TabType;
	ref: React.RefObject<AppTab>;
}

export interface ProjectEditorTab extends Tab {
	ref: React.RefObject<ProjectEditor>;
	project?: Project;
	projectFilePath?: string;
}

export function isProjectEditorTab(tab: Tab): tab is ProjectEditorTab {
	return tab.type === TabType.ProjectEditor;
}

export interface LevelEditorTab extends Tab {
	ref: React.RefObject<LevelEditor>;
	project?: Project;
	projectFilePath?: string;
	level?: Level;
	levelFilePath?: string;
}

export function isLevelEditorTab(tab: Tab): tab is LevelEditorTab {
	return tab.type === TabType.LevelEditor;
}

export interface State {
	activeTab: number;
	tabs: Array<Tab>;
	tabTitles: Array<string>;
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
		}

		ipcRenderer.on('new project', event => this.onOpenProjectEditor());
		ipcRenderer.on('open project', event => this.onOpenProject());
		ipcRenderer.on('open level', event => this.onOpenLevel());
		ipcRenderer.on('close tab', event => this.onCloseTab(this.state.activeTab));
		ipcRenderer.on('save', (event, saveAs) => this.onSave(saveAs));
	}
	
	onChangeTabTitle(tabIndex: number, title: string) {
		let tabTitles = this.state.tabTitles.slice(0, this.state.tabTitles.length);
		tabTitles[tabIndex] = title;
		this.setState({tabTitles: tabTitles});
	}

	onOpenProject() {
		remote.dialog.showOpenDialog({
			filters: [
				{name: 'GPGP projects', extensions: ['gpgpproj']},
			],
		}, paths => {
			if (!paths) return;
			paths.forEach(path => {
				fs.readFile(path, (error, data) => {
					if (error) {
						remote.dialog.showErrorBox('Error opening project', 'The project could not be opened.');
						return;
					}
					let project: Project = JSON.parse(data.toString());
					this.onOpenProjectEditor(importProject(project, path), path);
				})
			});
		});
	}

	onOpenProjectEditor(project?: Project, projectFilePath?: string) {
		let tabs = this.state.tabs.slice(0, this.state.tabs.length);
		let newTab = {
			type: TabType.ProjectEditor,
			ref: React.createRef<ProjectEditor>(),
			project: project,
			projectFilePath: projectFilePath,
		};
		tabs.push(newTab);
		let tabTitles = this.state.tabTitles.slice(0, this.state.tabTitles.length);
		tabTitles.push(project ? project.name : 'New project');
		this.setState({tabs: tabs, tabTitles: tabTitles}, () => {
			this.setState({activeTab: this.state.tabs.length - 1})
		});
	}

	onOpenLevel() {
		remote.dialog.showOpenDialog({
			filters: [
				{name: 'GPGP levels', extensions: ['gpgp']},
			],
		}, paths => {
			if (!paths) return;
			paths.forEach(path => {
				fs.readFile(path, (error, data) => {
					if (error)
						remote.dialog.showErrorBox('Error opening level', 'The level could not be opened.');
					else {
						let level = importLevel(JSON.parse(data.toString()), path);
						fs.readFile(level.projectFilePath, (error, data) => {
							if (error)
								remote.dialog.showErrorBox('Error opening project', "The level's project file could not be opened.");
							else {
								let project = importProject(JSON.parse(data.toString()), level.projectFilePath);
								this.onOpenLevelEditor(project, level.projectFilePath, level, path);
							}
						})
					}
				})
			});
		});
	}

	onOpenLevelEditor(project: Project, projectFilePath: string, level?: Level, levelFilePath?: string) {
		let tabs = this.state.tabs.slice(0, this.state.tabs.length);
		let newTab ={
			type: TabType.LevelEditor,
			ref: React.createRef<LevelEditor>(),
			project: project,
			projectFilePath: projectFilePath,
			level: level,
			levelFilePath: levelFilePath,
		};
		tabs.push(newTab);
		let tabTitles = this.state.tabTitles.slice(0, this.state.tabTitles.length);
		tabTitles.push(levelFilePath ? path.parse(levelFilePath).name : 'New level');
		this.setState({tabs: tabs, tabTitles: tabTitles}, () => {
			this.setState({activeTab: this.state.tabs.length - 1})
		});
	}

	onSave(saveAs?: boolean) {
		let tab = this.state.tabs[this.state.activeTab];
		if (!(tab && tab.ref.current)) return;
		tab.ref.current.save(saveAs);
	}

	onCloseTab(tabNumber: number) {
		let tab = this.state.tabs[tabNumber];
		if (!(tab && tab.ref.current)) return;
		tab.ref.current.exit(() => {
			let tabs = this.state.tabs.slice(0, this.state.tabs.length);
			tabs.splice(tabNumber, 1);
			let tabTitles = this.state.tabTitles.slice(0, this.state.tabTitles.length);
			tabTitles.splice(tabNumber, 1);
			this.setState({tabs: tabs, tabTitles: tabTitles}, () => {
				this.setState({activeTab: Math.min(this.state.activeTab, this.state.tabs.length - 1)})
			});
		});
	}

	render() {
		if (this.state.tabs.length === 0)
			return <Welcome
				onCreateNewProject={() => this.onOpenProjectEditor()}
				onOpenProject={() => this.onOpenProject()}
				onOpenLevel={() => this.onOpenLevel()}
			/>;
		return <div>
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
							<Octicon icon={Plus} />
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
				{this.state.tabs.map((tab, i) => {
					let tabContent: JSX.Element | string = '';
					if (isProjectEditorTab(tab))
						tabContent = <ProjectEditor
							ref={tab.ref}
							project={tab.project}
							projectFilePath={tab.projectFilePath}
							focused={this.state.activeTab === i}
							onCloseTab={() => {this.onCloseTab(i)}}
							onChangeTabTitle={title => {
								this.onChangeTabTitle(i, title);
							}}
							onCreateNewLevel={(project, projectFilePath) => this.onOpenLevelEditor(project, projectFilePath)}
						/>
					else if (isLevelEditorTab(tab))
						tabContent = <LevelEditor
							ref={tab.ref}
							project={tab.project}
							projectFilePath={tab.projectFilePath}
							level={tab.level}
							levelFilePath={tab.levelFilePath}
							focused={this.state.activeTab === i}
							onCloseTab={() => {this.onCloseTab(i)}}
							onChangeTabTitle={title => {
								this.onChangeTabTitle(i, title);
							}}
						/>
					return <TabPane
						key={i}
						tabId={i}
					>
						{tabContent}
					</TabPane>;
				})}
			</TabContent>
		</div>
	}
}
