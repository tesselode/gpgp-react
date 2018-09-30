import React, { Component } from 'react';
import {
	Form,
	FormGroup,
	Label,
	Input,
	InputGroup,
	InputGroupAddon,
	Col } from 'reactstrap';

export default class ProjectSettingsEditor extends Component {
	render() {
		return <Form>
			<FormGroup row>
				<Label sm={2}>Tile size</Label>
				<Col sm={10}>
					<InputGroup>
						<Input type='number' />
						<InputGroupAddon addonType='append'>pixels</InputGroupAddon>
					</InputGroup>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={2}>Default level width</Label>
				<Col sm={10}>
					<InputGroup>
						<Input type='number' />
						<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
					</InputGroup>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={2}>Default level height</Label>
				<Col sm={10}>
					<InputGroup>
						<Input type='number' />
						<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
					</InputGroup>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={2}>Max level width</Label>
				<Col sm={10}>
					<InputGroup>
						<Input type='number' />
						<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
					</InputGroup>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={2}>Max level height</Label>
				<Col sm={10}>
					<InputGroup>
						<Input type='number' />
						<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
					</InputGroup>
				</Col>
			</FormGroup>
		</Form>;
	}
}
