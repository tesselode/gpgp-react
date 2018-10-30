import Octicon, { ArrowDown, ArrowUp, Plus, Trashcan } from '@githubprimer/octicons-react';
import React from 'react';
import { ButtonGroup, Row, Form, Input } from 'reactstrap';
import Button from 'reactstrap/lib/Button';
import Col from 'reactstrap/lib/Col';
import ListGroup from 'reactstrap/lib/ListGroup';
import ListGroupItem from 'reactstrap/lib/ListGroupItem';
import Navbar from 'reactstrap/lib/Navbar';
import NavbarBrand from 'reactstrap/lib/NavbarBrand';
import Project from '../../data/project';
import { ProjectResources } from '../../data/project-resources';
import FormGroup from 'reactstrap/lib/FormGroup';
import Label from 'reactstrap/lib/Label';
import InputGroup from 'reactstrap/lib/InputGroup';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';

export interface Props {
	focused: boolean;
	project: Project;
	resources: ProjectResources;
	selectedEntityIndex: number;
	onSelectEntity: (entityIndex: number) => void;
	onAddEntity: () => void;
	onRemoveEntity: (entityIndex: number) => void;
	onMoveEntityUp: (entityIndex: number) => void;
	onMoveEntityDown: (entityIndex: number) => void;
	onChangeEntityName: (entityIndex: number, name: string) => void;
}

export default (props: Props) => {
	const selectedEntity = props.project.entities[props.selectedEntityIndex];
	return <Row>
		<Col md={4}>
			<Navbar color='light'>
				<NavbarBrand>Entities</NavbarBrand>
				<ButtonGroup>
					<Button
						disabled={!selectedEntity}
						onClick={() => props.onRemoveEntity(props.selectedEntityIndex)}
					>
						<Octicon icon={Trashcan}/>
					</Button>
					<Button
						onClick={() => props.onAddEntity()}
					>
						<Octicon icon={Plus}/>
					</Button>
					<Button
						disabled={!(selectedEntity && props.selectedEntityIndex !== 0)}
						onClick={() => props.onMoveEntityUp(props.selectedEntityIndex)}
					>
						<Octicon icon={ArrowUp}/>
					</Button>
					<Button
						disabled={!(selectedEntity && props.selectedEntityIndex !== props.project.entities.length - 1)}
						onClick={() => props.onMoveEntityDown(props.selectedEntityIndex)}
					>
						<Octicon icon={ArrowDown}/>
					</Button>
				</ButtonGroup>
			</Navbar>
			<ListGroup flush>
				{props.project.entities.map((tileset, i) =>
					<ListGroupItem
						key={i}
						active={i === props.selectedEntityIndex}
						onClick={() => props.onSelectEntity(i)}
					>
						{tileset.name}
					</ListGroupItem>)
				}
			</ListGroup>
		</Col>
		{selectedEntity && <Col md={8}>
			<Form>
				<FormGroup row>
					<Label md={2}>Tileset name</Label>
					<Col md={10}>
						<Input
							value={selectedEntity.name}
							onChange={(event) => props.onChangeEntityName(props.selectedEntityIndex, event.target.value)}
						/>
					</Col>
				</FormGroup>
			</Form>
		</Col>}
	</Row>;
};
