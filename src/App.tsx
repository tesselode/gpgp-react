import React from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane, Button, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import LevelEditor from './level/LevelEditor';
import ProjectEditor from './project/ProjectEditor';
import Welcome from './welcome';
import Project, { importProject } from './data/Project';
import Octicon, { Plus } from '@githubprimer/octicons-react';
import { remote } from 'electron';
import fs from 'fs';

export interface Tab {
	content?: JSX.Element,
	title?: string,
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
		let newTab: Tab = {title: project ? project.name : 'New project'};
		newTab.content = <ProjectEditor
			project={project}
			projectFilePath={projectFilePath}
			onChangeTabTitle={(title: string) => {
				newTab.title = title;
				this.setState({tabs: this.state.tabs});
			}}
			onCreateNewLevel={(project, projectFilePath) => this.onOpenNewLevel(project, projectFilePath)}
		/>
		let tabs = this.state.tabs.slice(0, this.state.tabs.length);
		tabs.push(newTab);
		this.setState({tabs: tabs}, () => {
			this.setState({activeTab: this.state.tabs.length - 1})
		});
	}

	onOpenNewLevel(project?: Project, projectFilePath?: string) {
		let newTab: Tab = {title: 'New level'};
		newTab.content = <LevelEditor
			project={project}
			projectFilePath={projectFilePath}
			onChangeTabTitle={(title: string) => {
				newTab.title = title;
				this.setState({tabs: this.state.tabs});
			}}
		/>
		let tabs = this.state.tabs.slice(0, this.state.tabs.length);
		tabs.push(newTab);
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
								onClick={() => {}}
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
					{tab.content}
				</TabPane>)}
			</TabContent>
		</div>
	}
}
