import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody, Collapse } from 'reactstrap';

export default class SidebarSection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: true,
		};
	}

	render() {
		return(<Card>
			<CardHeader
				onClick={() => this.setState({expanded: !this.state.expanded})}
				style={{
					padding: '0',
					cursor: 'pointer',
				}}
			>
				<Button color='link'>{this.props.title}</Button>
			</CardHeader>
			<Collapse isOpen={this.state.expanded} style={{transition: '.15s'}}>
				<CardBody style={{padding: '0'}}>
					{this.props.children}
				</CardBody>
			</Collapse>
		</Card>);
	}
}
