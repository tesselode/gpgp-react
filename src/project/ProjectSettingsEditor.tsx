import React from 'react';
import {
	Col,
	Form,
	FormGroup,
	Label,
	InputGroup,
	InputGroupAddon,
	Input,
} from 'reactstrap';

export default class ProjectSettingsEditor extends React.Component {
	render() {
		return <Form>
			<FormGroup row>
				<Label md={2}>Tile size</Label>
				<Col md={10}>
					<InputGroup>
						<Input />
						<InputGroupAddon addonType='append'>
							pixels
						</InputGroupAddon>
					</InputGroup>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label md={2}>Default map width</Label>
				<Col md={10}>
					<InputGroup>
						<Input />
						<InputGroupAddon addonType='append'>
							tiles
						</InputGroupAddon>
					</InputGroup>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label md={2}>Default map height</Label>
				<Col md={10}>
					<InputGroup>
						<Input />
						<InputGroupAddon addonType='append'>
							tiles
						</InputGroupAddon>
					</InputGroup>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label md={2}>Max map width</Label>
				<Col md={10}>
					<InputGroup>
						<Input />
						<InputGroupAddon addonType='append'>
							tiles
						</InputGroupAddon>
					</InputGroup>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label md={2}>Max map height</Label>
				<Col md={10}>
					<InputGroup>
						<Input />
						<InputGroupAddon addonType='append'>
							tiles
						</InputGroupAddon>
					</InputGroup>
				</Col>
			</FormGroup>
		</Form>;
	}
}
