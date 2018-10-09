import React from 'react';
import {
	Nav,
	NavItem,
	NavLink,
	TabPane,
	TabContent,
	Form,
} from 'reactstrap';
import ValidatedInput from '../ui/ValidatedInput';

export enum ProjectEditorTab {
	Settings,
	Tilesets,
}

export interface State {
	activeTab: ProjectEditorTab;
	tileSize: number;
	defaultMapWidth: number;
	defaultMapHeight: number;
	maxMapWidth: number;
	maxMapHeight: number;
}

function isValidSize(size: number) {
	return size !== NaN && size > 0;
}

export default class ProjectEditor extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			tileSize: 16,
			defaultMapWidth: 16,
			defaultMapHeight: 9,
			maxMapWidth: 1000,
			maxMapHeight: 1000,
			activeTab: ProjectEditorTab.Settings,
		};
	}

	render() {
		return <div>
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
					<Form>
						<ValidatedInput
							label='Tile size'
							type='number'
							value={this.state.tileSize}
							isValid={value => isValidSize(value)}
							onChange={(tileSize) => this.setState({tileSize: tileSize})}
							units='pixels'
							errorMessage='Tile size must be 1 pixel or greater'
						/>
						<ValidatedInput
							label='Default map width'
							type='number'
							value={this.state.defaultMapWidth}
							isValid={value => isValidSize(value)}
							onChange={(defaultMapWidth) => this.setState({defaultMapWidth: defaultMapWidth})}
							units='tiles'
							errorMessage='Default map width must be 1 tile or greater'
						/>
						<ValidatedInput
							label='Default map height'
							type='number'
							value={this.state.defaultMapHeight}
							isValid={value => isValidSize(value)}
							onChange={(defaultMapHeight) => this.setState({defaultMapHeight: defaultMapHeight})}
							units='tiles'
							errorMessage='Default map height must be 1 tile or greater'
						/>
						<ValidatedInput
							label='Max map width'
							type='number'
							value={this.state.maxMapWidth}
							isValid={value => isValidSize(value)}
							onChange={(maxMapWidth) => this.setState({maxMapWidth: maxMapWidth})}
							units='tiles'
							errorMessage='Max map width must be 1 tile or greater'
						/>
						<ValidatedInput
							label='Max map height'
							type='number'
							value={this.state.maxMapHeight}
							isValid={value => isValidSize(value)}
							onChange={(maxMapHeight) => this.setState({maxMapHeight: maxMapHeight})}
							units='tiles'
							errorMessage='Max map height must be 1 tile or greater'
						/>
					</Form>
				</TabPane>
				<TabPane tabId={ProjectEditorTab.Tilesets}>
				</TabPane>
			</TabContent>
		</div>;
	}
}
