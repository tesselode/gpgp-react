import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody, Collapse, Navbar } from 'reactstrap';

export default class SidebarSection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: true,
		};
	}

	render() {
		let style = this.props.flush ? {padding: '0'} : {}

		return(<Card style={{userSelect: 'none'}}>
			<CardHeader style={{padding: '0'}}>
				<Navbar style={{padding: '0'}}>
					<Button
						color='link'
						onClick={() => this.setState({expanded: !this.state.expanded})}
					>
						{this.props.title}
					</Button>
					{this.props.headerContent}
				</Navbar>
			</CardHeader>
			<Collapse isOpen={this.state.expanded} style={{transition: '.15s'}}>
				<CardBody style={style}>
					{this.props.children}
				</CardBody>
			</Collapse>
		</Card>);
	}
}
