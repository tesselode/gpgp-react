import React from 'react';
import { Collapse, Card, CardHeader, CardBody, Navbar, Button } from 'reactstrap';

export interface Props {
	name: string,
	startExpanded?: boolean,
	flush?: boolean,
	headerContent?: JSX.Element,
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
