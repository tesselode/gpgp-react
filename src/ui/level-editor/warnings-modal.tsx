import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import SidebarSection from './sidebar/sidebar-section';

interface Props {
	warnings: string[];
}

interface State {
	isOpen: boolean;
}

export default class WarningsModal extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: this.props.warnings.length > 0,
		};
	}

	public render() {
		return <Modal
			isOpen={this.state.isOpen}
			toggle={() => this.setState({isOpen: !this.state.isOpen})}
			backdrop='static'
		>
			<ModalHeader>Conflicts when loading level</ModalHeader>
			<ModalBody>
				<p>
					Some data in this level is incompatible with the project file and will be discarded.
					No data has been modified on disk yet, but you may lose data if you save this level over the original file.
				</p>
				<SidebarSection
					name='Warnings'
				>
					<ul>
						{this.props.warnings.map((warning, i) => <li
							key={i}
						>
							{warning}
						</li>)}
					</ul>
				</SidebarSection>
			</ModalBody>
			<ModalFooter>
				<Button
					onClick={() => this.setState({isOpen: false})}
				>
					I understand
				</Button>
			</ModalFooter>
		</Modal>;
	}
}
