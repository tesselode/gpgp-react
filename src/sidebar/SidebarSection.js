import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody, Collapse, Navbar } from 'reactstrap';
import Octicon, { ChevronUp, ChevronDown } from '@githubprimer/octicons-react';

export default class SidebarSection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: true,
		};
	}

	render() {
		return(<Card style={{userSelect: 'none', marginBottom: '1em'}}>
			<CardHeader style={{padding: '0'}}>
				<Navbar style={{padding: '0'}}>
					<Button
						size='sm'
						color='link'
						onClick={() => this.setState({expanded: !this.state.expanded})}
					>
						{this.props.title} <Octicon icon={this.state.expanded ? ChevronDown : ChevronUp} />
					</Button>
					{this.props.headerContent}
				</Navbar>
			</CardHeader>
			<Collapse isOpen={this.state.expanded} style={{transition: '.15s'}}>
				<CardBody style={this.props.flush ? {padding: '0'} : {}}>
					{this.props.children}
				</CardBody>
			</Collapse>
		</Card>);
	}
}
