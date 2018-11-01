import React from 'react';
import { Row } from 'reactstrap';
import Col from 'reactstrap/lib/Col';
import {
	EntityParameterType,
} from '../../data/entity';
import Image from '../../data/image-data';
import Project from '../../data/project';
import ColorDisplay from './color-display';
import ItemList from './item-list';
import EntityEditor from './project-entity-editor';

export interface Props {
	focused: boolean;
	project: Project;
	images: Map<string, Image>;
	onAddEntity: () => void;
	onRemoveEntity: (entityIndex: number) => void;
	onMoveEntityUp: (entityIndex: number) => void;
	onMoveEntityDown: (entityIndex: number) => void;
	onChangeEntityName: (entityIndex: number, name: string) => void;
	onChangeEntityColor: (entityIndex: number, color: string) => void;
	onChangeEntityWidth: (entityIndex: number, width: number) => void;
	onChangeEntityHeight: (entityIndex: number, height: number) => void;
	onChooseEntityImage: (entityIndex: number, imagePath: string) => void;
	onAddParameter: (entityIndex: number) => void;
	onRemoveParameter: (entityIndex: number, parameterIndex: number) => void;
	onMoveParameterUp: (entityIndex: number, parameterIndex: number) => void;
	onMoveParameterDown: (entityIndex: number, parameterIndex: number) => void;
	onChangeParameterName: (entityIndex: number, parameterIndex: number, name: string) => void;
	onChangeParameterType: (entityIndex: number, parameterIndex: number, type: EntityParameterType) => void;
}

export interface State {
	selectedEntityIndex: number;
	selectedParameterIndex: number;
}

export default class ProjectEntitiesEditor extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			selectedEntityIndex: 0,
			selectedParameterIndex: 0,
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
					onAddItem={this.props.onAddEntity}
					onRemoveItem={this.props.onRemoveEntity}
					onMoveItemUp={this.props.onMoveEntityUp}
					onMoveItemDown={this.props.onMoveEntityDown}
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
					selectedParameterIndex={this.state.selectedParameterIndex}
					onChangeEntityName={name => this.props.onChangeEntityName(this.state.selectedEntityIndex, name)}
					onChangeEntityColor={color => this.props.onChangeEntityColor(this.state.selectedEntityIndex, color)}
					onChangeEntityWidth={width => this.props.onChangeEntityWidth(this.state.selectedEntityIndex, width)}
					onChangeEntityHeight={height => this.props.onChangeEntityHeight(this.state.selectedEntityIndex, height)}
					onChooseEntityImage={imagePath => this.props.onChooseEntityImage(this.state.selectedEntityIndex, imagePath)}
					onSelectParameter={parameterIndex => this.setState({selectedParameterIndex: parameterIndex})}
					onAddParameter={() => this.props.onAddParameter(this.state.selectedEntityIndex)}
					onRemoveParameter={parameterIndex => this.props.onRemoveParameter(this.state.selectedEntityIndex, parameterIndex)}
					onMoveParameterDown={parameterIndex =>
						this.props.onMoveParameterDown(this.state.selectedEntityIndex, parameterIndex)
					}
					onMoveParameterUp={parameterIndex => this.props.onMoveParameterUp(this.state.selectedEntityIndex, parameterIndex)}
					onChangeParameterName={(parameterIndex, name) =>
						this.props.onChangeParameterName(this.state.selectedEntityIndex, parameterIndex, name)
					}
					onChangeParameterType={(parameterIndex, type) =>
						this.props.onChangeParameterType(this.state.selectedEntityIndex, parameterIndex, type)
					}
				/>
			</Col>}
		</Row>;
	}
}
