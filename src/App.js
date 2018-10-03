import React, { Component } from 'react';
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import Octicon, { Plus } from '@githubprimer/octicons-react';
import LevelEditor from './level/LevelEditor';
import ProjectEditor from './project/ProjectEditor';

export default class App extends Component {
	constructor(props) {
		super(props);

		let projectEditorTab = {title: 'New project'};
		projectEditorTab.content = <ProjectEditor
			onChangeTabTitle={(title) => {
				projectEditorTab.title = title;
			}}
		/>

		let levelEditorTab = {title: 'New level'};
		levelEditorTab.content = <LevelEditor
			onChangeTabTitle={(title) => {
				levelEditorTab.title = title;
			}}
		/>

		this.state = {
			tabs: [projectEditorTab, levelEditorTab],
			selectedTabIndex: 0,
		};
	}

	render() {
		return <div>
			<Nav tabs>
				{this.state.tabs.map((tab, i) =>
					<NavItem key={i}>
						<NavLink
							active={this.state.selectedTabIndex === i}
							onClick={() => this.setState({selectedTabIndex: i})}
						>
							{tab.title}
						</NavLink>
					</NavItem>
				)}
				<NavItem>
					<Button
						color='link'
					>
						<Octicon icon={Plus} />
					</Button>
				</NavItem>
			</Nav>
			<TabContent activeTab={this.state.selectedTabIndex}>
				{this.state.tabs.map((tab, i) =>
					<TabPane key={i} tabId={i}>
						{tab.content}
					</TabPane>
				)}
			</TabContent>
		</div>
	}
}
