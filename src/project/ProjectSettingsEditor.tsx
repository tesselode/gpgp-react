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
	onTileSizeChanged: (tileSize: number) => void;
	onDefaultMapWidthChanged: (defaultMapWidth: number) => void;
	onDefaultMapHeightChanged: (defaultMapHeight: number) => void;
	onMaxMapWidthChanged: (maxMapWidth: number) => void;
	onMaxMapHeightChanged: (maxMapHeight: number) => void;
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
							props.onTileSizeChanged(value);
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
							props.onDefaultMapWidthChanged(value);
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
							props.onDefaultMapHeightChanged(value);
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
							props.onMaxMapWidthChanged(value);
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
							props.onMaxMapHeightChanged(value);
						}
					}}
				/>
				<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
			</InputGroup>
		</Col>
	</FormGroup>
</Form>
