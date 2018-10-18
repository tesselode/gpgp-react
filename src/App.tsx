import React from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane, Button } from 'reactstrap';
import LevelEditor from './level/LevelEditor';
import ProjectEditor from './project/ProjectEditor';
import Welcome from './welcome';
import Project from './data/Project';

export interface Tab {
	content?: JSX.Element,
	title?: string,
}

export interface State {
	activeTab: number;
	tabs: Array<Tab>;
}

export default class App extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: 0,
			tabs: [],
		}
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
				onOpenProject={(project: Project, projectFilePath: string) => this.onOpenProjectEditor(project, projectFilePath)}
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
