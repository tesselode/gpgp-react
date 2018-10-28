import React from 'react';
import { Button, Card, CardBody, CardHeader, Collapse, Navbar } from 'reactstrap';

export interface Props {
	/** The title of the sidebar section. */
	name: string;
	/** Whether the section should be expanded by default. */
	startExpanded?: boolean;
	/** Whether the contents of the section should have zero padding. */
	flush?: boolean;
	/** Additional elements to add to the section header. */
	headerContent?: JSX.Element;
}

export interface State {
	/** Whether the section is currently expanded. */
	expanded: boolean;
}

/** A collapsible card used for the various settings groups in the level editor sidebar. */
export default class SidebarSection extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			expanded: this.props.startExpanded,
		};
	}

	public render() {
		return <Card style={{marginBottom: '1em'}}>
			<CardHeader
				style={{padding: 0}}
			>
				<Navbar style={{padding: 0}}>
					<Button
						color='link'
						size='sm'
						onClick={() => this.setState({expanded: !this.state.expanded})}
					>
						{this.props.name}
					</Button>
					{this.props.headerContent}
				</Navbar>
			</CardHeader>
			<Collapse isOpen={this.state.expanded} style={{transition: '.2s'}} >
				<CardBody
					style={this.props.flush && {padding: 0}}
				>
					{this.props.children}
				</CardBody>
			</Collapse>
		</Card>;
	}
}
