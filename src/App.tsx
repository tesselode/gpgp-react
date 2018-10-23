import React from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane, Button, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import LevelEditor from './level/LevelEditor';
import ProjectEditor from './project/ProjectEditor';
import Welcome from './welcome';
import Project, { importProject } from './data/Project';
import Octicon, { Plus } from '@githubprimer/octicons-react';
import { remote, ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';
import './App.css';
import Level, { importLevel } from './data/Level';
import { deepCopyObject } from './util';

export enum TabType {
	ProjectEditor = 'ProjectEditor',
	LevelEditor = 'LevelEditor',
}

export interface Tab {
	title: string;
	type: TabType;
	project?: Project;
	projectFilePath?: string;
	level?: Level;
	levelFilePath?: string;
}

export interface State {
	activeTab: number;
	tabs: Array<Tab>;
	newTabDropdownOpen: boolean;
}

export default class App extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: 0,
			tabs: [],
			newTabDropdownOpen: false,
		}

		ipcRenderer.on('new project', event => this.onOpenProjectEditor());
		ipcRenderer.on('open project', event => this.onOpenProject());
		ipcRenderer.on('open level', event => this.onOpenLevel());
		ipcRenderer.on('close tab', event => this.onCloseTab(this.state.activeTab));
	}
	
	onChangeTabTitle(tabIndex: number, title: string) {
		let tabs = deepCopyObject(this.state.tabs);
		tabs[tabIndex].title = title;
		this.setState({tabs: tabs});
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
		tabs.push({
			title: project ? project.name : 'New project',
			type: TabType.ProjectEditor,
			project: project,
			projectFilePath: projectFilePath,
		});
		this.setState({tabs: tabs}, () => {
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
		tabs.push({
			title: levelFilePath ? path.parse(levelFilePath).name : 'New level',
			type: TabType.LevelEditor,
			project: project,
			projectFilePath: projectFilePath,
			level: level,
			levelFilePath: levelFilePath,
		});
		this.setState({tabs: tabs}, () => {
			this.setState({activeTab: this.state.tabs.length - 1})
		});
	}

	onCloseTab(tabNumber: number) {
		let tabs = this.state.tabs.slice(0, this.state.tabs.length);
		tabs.splice(tabNumber, 1);
		this.setState({tabs: tabs}, () => {
			this.setState({activeTab: Math.min(this.state.activeTab, this.state.tabs.length - 1)})
		})
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
						{tab.title}
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
					let tabContent;
					switch (tab.type) {
						case TabType.ProjectEditor:
							tabContent = <ProjectEditor
								project={tab.project}
								projectFilePath={tab.projectFilePath}
								focused={this.state.activeTab === i}
								onChangeTabTitle={title => {
									this.onChangeTabTitle(i, title);
								}}
								onCreateNewLevel={(project, projectFilePath) => this.onOpenLevelEditor(project, projectFilePath)}
							/>
							break;
						case TabType.LevelEditor:
							tabContent = <LevelEditor
								project={tab.project}
								projectFilePath={tab.projectFilePath}
								level={tab.level}
								levelFilePath={tab.levelFilePath}
								focused={this.state.activeTab === i}
								onChangeTabTitle={title => {
									this.onChangeTabTitle(i, title);
								}}
							/>
							break;
						default:
							tabContent = '';
					}
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
