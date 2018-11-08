import React from 'react';
import { Row } from 'reactstrap';
import Col from 'reactstrap/lib/Col';
import { newEntity } from '../../data/entity';
import Image from '../../data/image-data';
import Project from '../../data/project';
import { shiftDown, shiftUp } from '../../util';
import ColorDisplay from '../common/color-display';
import ItemList from './item-list';
import EntityEditor from './project-entity-editor';

export interface Props {
	project: Project;
	images: Map<string, Image>;
	modifyProject: (f: (project: Project) => void) => void;
}

export interface State {
	selectedEntityIndex: number;
}

export default class ProjectEntitiesTab extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			selectedEntityIndex: 0,
		};
	}

	public render() {
		const selectedEntity = this.props.project.entities[this.state.selectedEntityIndex];
		return <Row>
			<Col md={4}>
				<ItemList
					title='Entities'
					selectedItemIndex={this.state.selectedEntityIndex}
					items={this.props.project.entities}
					onSelectItem={entityIndex => this.setState({selectedEntityIndex: entityIndex})}
					onAddItem={() => this.props.modifyProject(project => {
						project.entities.push(newEntity());
					})}
					onRemoveItem={entityIndex => this.props.modifyProject(project => {
						project.entities.splice(entityIndex, 1);
					})}
					onMoveItemUp={entityIndex => this.props.modifyProject(project => {
						shiftUp(project.entities, entityIndex);
					})}
					onMoveItemDown={entityIndex => this.props.modifyProject(project => {
						shiftDown(project.entities, entityIndex);
					})}
					renderItem={entity => <div>
						{
							entity.imagePath && this.props.images.get(entity.imagePath) ?
								<img
									src={this.props.images.get(entity.imagePath).data}
									style={{
										width: 'auto',
										height: '1em',
									}}
								/>
								: ColorDisplay(entity.color)
						}
						&nbsp;&nbsp;
						{entity.name}
					</div>}
				/>
			</Col>
			{selectedEntity && <Col md={8}>
				<EntityEditor
					entity={selectedEntity}
					modifyEntity={f => this.props.modifyProject(project => {
						f(project.entities[this.state.selectedEntityIndex]);
					})}
				/>
			</Col>}
		</Row>;
	}
}
