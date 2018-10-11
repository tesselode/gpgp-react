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
import Project from '../data/Project';

export interface Props {
	project: Project;
	onChangeTileSize: (tileSize: number) => void;
	onChangeDefaultMapWidth: (defaultMapWidth: number) => void;
	onChangeDefaultMapHeight: (defaultMapHeight: number) => void;
	onChangeMaxMapWidth: (maxMapWidth: number) => void;
	onChangeMaxMapHeight: (maxMapHeight: number) => void;
}

export default (props: Props) => <Form>
	<FormGroup row>
		<Label md={2}>Tile size</Label>
		<Col md={10}>
			<InputGroup>
				<Input
					type='number'
					value={props.project.tileSize}
					onChange={(event) => {
						let value = Number(event.target.value);
						if (value !== NaN && value > 0) {
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
						let value = Number(event.target.value);
						if (value !== NaN && value > 0) {
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
						let value = Number(event.target.value);
						if (value !== NaN && value > 0) {
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
						let value = Number(event.target.value);
						if (value !== NaN && value > 0) {
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
						let value = Number(event.target.value);
						if (value !== NaN && value > 0) {
							props.onChangeMaxMapHeight(value);
						}
					}}
				/>
				<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
			</InputGroup>
		</Col>
	</FormGroup>
</Form>
