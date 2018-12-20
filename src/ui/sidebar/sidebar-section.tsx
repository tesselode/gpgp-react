import React from 'react';
import { Button, Card, CardBody, CardHeader, Collapse, Navbar, NavbarBrand } from 'reactstrap';

interface Props {
	title: string;
	flush?: boolean;
	headerContent?: JSX.Element;
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
		return <Card style={{marginBottom: '1em'}}>
			<CardHeader style={{padding: 0}}>
				<Navbar style={{padding: 0}}>
					<Button
						color='link'
						size='sm'
						onClick={() => {
							this.setState({expanded: !this.state.expanded});
						}}
					>
						{this.props.title}
					</Button>
					{this.props.headerContent}
				</Navbar>
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
