import React from 'react';
import { Button, Card, CardBody, CardHeader, Collapse, Navbar, NavbarBrand } from 'reactstrap';

interface Props {
	title: string;
	flush?: boolean;
}

interface State {
	expanded: boolean;
}

export default class SidebarSection extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			expanded: false,
		};
	}

	public render() {
		return <Card>
			<CardHeader
				style={{
					padding: '.5em',
					cursor: 'pointer',
				}}
				onClick={() => {
					this.setState({expanded: !this.state.expanded});
				}}
			>
				{this.props.title}
			</CardHeader>
			<Collapse isOpen={this.state.expanded}>
				<CardBody
					style={{
						padding: this.props.flush && 0,
					}}
				>
					{this.props.children}
				</CardBody>
			</Collapse>
		</Card>;
	}
}
