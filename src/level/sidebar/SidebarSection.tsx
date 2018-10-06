import React from 'react';
import { Collapse, Card, CardHeader, CardBody, Button } from 'reactstrap';

export interface Props {
	name: string,
	startExpanded?: boolean,
	flush?: boolean,
}

export interface State {
	expanded: boolean,
}

export default class SidebarSection extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			expanded: this.props.startExpanded,
		}
	}

	render() {
		return <Card>
			<CardHeader
				style={{padding: 0}}
			>
				<Button
					color='link'
					block
					onClick={() => this.setState({expanded: !this.state.expanded})}
				>
					{this.props.name}
				</Button>
			</CardHeader>
			<Collapse isOpen={this.state.expanded} >
				<CardBody
					style={this.props.flush && {padding: 0}}
				>
					{this.props.children}
				</CardBody>
			</Collapse>
		</Card>;
	}
}
