import React from 'react';
import {
	Col,
	Form,
	FormGroup,
	Input,
	InputGroup,
	InputGroupAddon,
	Label,
} from 'reactstrap';
import Project from '../../data/project/project';

export interface Props {
	project: Project;
	setProject: (project: Project) => void;
}

export default (props: Props) => <Form>
	<FormGroup row>
		<Label md={2}>Project name</Label>
		<Col md={10}>
			<Input
				value={props.project.data.name}
				onChange={event => props.setProject(props.project.setName(event.target.value))}
			/>
		</Col>
	</FormGroup>
	<FormGroup row>
		<Label md={2}>Tile size</Label>
		<Col md={10}>
			<InputGroup>
				<Input
					type='number'
					value={props.project.data.tileSize}
					onChange={(event) => {
						const value = Number(event.target.value);
						if (!isNaN(value) && value > 0) {
							props.setProject(props.project.setTileSize(value));
						}
					}}
				/>
				<InputGroupAddon addonType='append'>pixels</InputGroupAddon>
			</InputGroup>
		</Col>
	</FormGroup>
	<FormGroup row>
		<Label md={2}>Default map width</Label>
		<Col md={10}>
			<InputGroup>
				<Input
					type='number'
					value={props.project.data.defaultMapWidth}
					onChange={(event) => {
						const value = Number(event.target.value);
						if (!isNaN(value) && value > 0) {
							props.setProject(props.project.setDefaultMapWidth(value));
						}
					}}
				/>
				<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
			</InputGroup>
		</Col>
	</FormGroup>
	<FormGroup row>
		<Label md={2}>Default map height</Label>
		<Col md={10}>
			<InputGroup>
				<Input
					type='number'
					value={props.project.data.defaultMapHeight}
					onChange={(event) => {
						const value = Number(event.target.value);
						if (!isNaN(value) && value > 0) {
							props.setProject(props.project.setDefaultMapHeight(value));
						}
					}}
				/>
				<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
			</InputGroup>
		</Col>
	</FormGroup>
	<FormGroup row>
		<Label md={2}>Max map width</Label>
		<Col md={10}>
			<InputGroup>
				<Input
					type='number'
					value={props.project.data.maxMapWidth}
					onChange={(event) => {
						const value = Number(event.target.value);
						if (!isNaN(value) && value > 0) {
							props.setProject(props.project.setMaxMapWidth(value));
						}
					}}
				/>
				<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
			</InputGroup>
		</Col>
	</FormGroup>
	<FormGroup row>
		<Label md={2}>Max map height</Label>
		<Col md={10}>
			<InputGroup>
				<Input
					type='number'
					value={props.project.data.maxMapHeight}
					onChange={(event) => {
						const value = Number(event.target.value);
						if (!isNaN(value) && value > 0) {
							props.setProject(props.project.setMaxMapHeight(value));
						}
					}}
				/>
				<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
			</InputGroup>
		</Col>
	</FormGroup>
</Form>;
