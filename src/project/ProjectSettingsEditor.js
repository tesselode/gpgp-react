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
	onProjectNameChanged(name) {
		this.props.onChangeTabTitle(name);
		this.props.onProjectNameChanged(name);
	}

	render() {
		return <Form>
			<FormGroup row>
				<Label sm={2}>Project name</Label>
				<Col sm={10}>
					<InputGroup>
						<Input
							value={this.props.projectName}
							onChange={(event) => this.onProjectNameChanged(event.target.value)}
						/>
						<InputGroupAddon addonType='append'>pixels</InputGroupAddon>
					</InputGroup>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={2}>Tile size</Label>
				<Col sm={10}>
					<InputGroup>
						<Input
							type='number'
							value={this.props.tileSize}
							onChange={(event) => this.props.onTileSizeChanged(event.target.value)}
						/>
						<InputGroupAddon addonType='append'>pixels</InputGroupAddon>
					</InputGroup>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={2}>Default level width</Label>
				<Col sm={10}>
					<InputGroup>
						<Input
							type='number'
							value={this.props.defaultLevelWidth}
							onChange={(event) => this.props.onDefaultLevelWidthChanged(event.target.value)}
						/>
						<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
					</InputGroup>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={2}>Default level height</Label>
				<Col sm={10}>
					<InputGroup>
						<Input
							type='number'
							value={this.props.defaultLevelHeight}
							onChange={(event) => this.props.onDefaultLevelHeightChanged(event.target.value)}
						/>
						<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
					</InputGroup>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={2}>Max level width</Label>
				<Col sm={10}>
					<InputGroup>
						<Input
							type='number'
							value={this.props.maxLevelWidth}
							onChange={(event) => this.props.onMaxLevelWidthChanged(event.target.value)}
						/>
						<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
					</InputGroup>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={2}>Max level height</Label>
				<Col sm={10}>
					<InputGroup>
						<Input
							type='number'
							value={this.props.maxLevelHeight}
							onChange={(event) => this.props.onMaxLevelHeightChanged(event.target.value)}
						/>
						<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
					</InputGroup>
				</Col>
			</FormGroup>
		</Form>;
	}
}
