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
import Project from '../../data/project';

export interface Props {
	project: Project;
	onChangeProjectName: (name: string) => void;
	onChangeTileSize: (tileSize: number) => void;
	onChangeDefaultMapWidth: (defaultMapWidth: number) => void;
	onChangeDefaultMapHeight: (defaultMapHeight: number) => void;
	onChangeMaxMapWidth: (maxMapWidth: number) => void;
	onChangeMaxMapHeight: (maxMapHeight: number) => void;
}

export default (props: Props) => <Form>
	<FormGroup row>
		<Label md={2}>Project name</Label>
		<Col md={10}>
			<Input
				value={props.project.name}
				onChange={event => props.onChangeProjectName(event.target.value)}
			/>
		</Col>
	</FormGroup>
	<FormGroup row>
		<Label md={2}>Tile size</Label>
		<Col md={10}>
			<InputGroup>
				<Input
					type='number'
					value={props.project.tileSize}
					onChange={(event) => {
						const value = Number(event.target.value);
						if (!isNaN(value) && value > 0) {
							props.onChangeTileSize(value);
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
					value={props.project.defaultMapWidth}
					onChange={(event) => {
						const value = Number(event.target.value);
						if (!isNaN(value) && value > 0) {
							props.onChangeDefaultMapWidth(value);
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
					value={props.project.defaultMapHeight}
					onChange={(event) => {
						const value = Number(event.target.value);
						if (!isNaN(value) && value > 0) {
							props.onChangeDefaultMapHeight(value);
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
					value={props.project.maxMapWidth}
					onChange={(event) => {
						const value = Number(event.target.value);
						if (!isNaN(value) && value > 0) {
							props.onChangeMaxMapWidth(value);
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
					value={props.project.maxMapHeight}
					onChange={(event) => {
						const value = Number(event.target.value);
						if (!isNaN(value) && value > 0) {
							props.onChangeMaxMapHeight(value);
						}
					}}
				/>
				<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
			</InputGroup>
		</Col>
	</FormGroup>
</Form>;
