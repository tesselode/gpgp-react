import { remote } from 'electron';
import React from 'react';
import {
	Button,
	Col,
	Form,
	FormGroup,
	Input,
	InputGroup,
	InputGroupAddon,
	Label,
	Nav,
	NavItem,
	NavLink,
	Row,
	TabContent,
	TabPane,
} from 'reactstrap';
import Image from '../../data/image';
import Project from '../../data/project/project';
import ColorDisplay from '../common/color-display';
import ItemList from './item-list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faEraser } from '@fortawesome/free-solid-svg-icons';

enum EntityEditorTab {
	Entities,
	Parameters,
}

interface Props {
	project: Project;
	images: Map<string, Image>;
	setProject: (project: Project) => void;
}

interface State {
	activeTab: EntityEditorTab;
	selectedEntityIndex: number;
	selectedParameterIndex: number;
}

export default class ProjectEntitiesTab extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: EntityEditorTab.Entities,
			selectedEntityIndex: 0,
			selectedParameterIndex: 0,
		};
	}

	private chooseEntityImage() {
		remote.dialog.showOpenDialog({
			filters: [
				{name: 'Images', extensions: ['jpg', 'png']},
			],
		}, paths => {
			if (paths) {
				const entity = this.props.project.data.entities[this.state.selectedEntityIndex];
				this.props.setProject(this.props.project.setEntity(
					this.state.selectedEntityIndex,
					entity.setImagePath(paths[0]),
				));
			}
		});
	}

	private renderEntityList() {
		return <ItemList
			title='Entities'
			selectedItemIndex={this.state.selectedEntityIndex}
			items={this.props.project.data.entities}
			onSelectItem={entityIndex => this.setState({selectedEntityIndex: entityIndex})}
			onAddItem={() => this.props.setProject(this.props.project.addEntity(this.state.selectedEntityIndex))}
			onRemoveItem={entityIndex => this.props.setProject(this.props.project.removeEntity(entityIndex))}
			onMoveItemUp={entityIndex => this.props.setProject(this.props.project.moveEntityUp(entityIndex))}
			onMoveItemDown={entityIndex => this.props.setProject(this.props.project.moveEntityDown(entityIndex))}
			renderItem={entity => <div>
				{
					entity.data.imagePath && this.props.images.get(entity.data.imagePath) ?
						<img
							src={this.props.images.get(entity.data.imagePath).data}
							style={{
								width: 'auto',
								height: '1em',
							}}
						/>
						: ColorDisplay(entity.data.color)
				}
				&nbsp;&nbsp;
				{entity.data.name}
			</div>}
		/>;
	}

	private renderParameterList() {
		const selectedEntity = this.props.project.data.entities[this.state.selectedEntityIndex];
		return <ItemList
			title='Parameters'
			addMenuItems={['Boolean']}
			selectedItemIndex={this.state.selectedParameterIndex}
			items={selectedEntity.data.parameters}
			onSelectItem={parameterIndex => this.setState({selectedParameterIndex: parameterIndex})}
			onAddItem={parameterType => {
				switch (parameterType) {
					case 0:
						this.props.setProject(
							this.props.project.setEntity(
								this.state.selectedEntityIndex,
								selectedEntity.addBooleanParameter(this.state.selectedParameterIndex),
							),
						);
						break;
				}
			}}
			onRemoveItem={parameterIndex => this.props.setProject(
				this.props.project.setEntity(
					this.state.selectedEntityIndex,
					selectedEntity.removeParameter(parameterIndex),
				),
			)}
			onMoveItemUp={parameterIndex => this.props.setProject(
				this.props.project.setEntity(
					this.state.selectedEntityIndex,
					selectedEntity.moveParameterUp(parameterIndex),
				),
			)}
			onMoveItemDown={parameterIndex => this.props.setProject(
				this.props.project.setEntity(
					this.state.selectedEntityIndex,
					selectedEntity.moveParameterDown(parameterIndex),
				),
			)}
			renderItem={parameter => parameter.data.name + ' (' + parameter.data.type + ')'}
		/>;
	}

	private renderSidebar() {
		const selectedEntity = this.props.project.data.entities[this.state.selectedEntityIndex];
		return <div>
			<Nav tabs>
				<NavItem>
					<NavLink
						active={this.state.activeTab === EntityEditorTab.Entities}
						onClick={() => this.setState({activeTab: EntityEditorTab.Entities})}
					>
						Entities
					</NavLink>
				</NavItem>
				{selectedEntity && <NavItem>
					<NavLink
						active={this.state.activeTab === EntityEditorTab.Parameters}
						onClick={() => this.setState({activeTab: EntityEditorTab.Parameters})}
					>
						Parameters - {selectedEntity.data.name}
					</NavLink>
				</NavItem>}
			</Nav>
			<TabContent activeTab={this.state.activeTab}>
				<TabPane tabId={EntityEditorTab.Entities}>
					{this.renderEntityList()}
				</TabPane>
				{selectedEntity && <TabPane tabId={EntityEditorTab.Parameters}>
					{this.renderParameterList()}
				</TabPane>}
			</TabContent>
		</div>;
	}

	private renderEntityEditorForm() {
		const selectedEntity = this.props.project.data.entities[this.state.selectedEntityIndex];
		return <Form>
			<FormGroup row>
				<Label md={2}>Entity name</Label>
				<Col md={10}>
					<Input
						value={selectedEntity.data.name}
						onChange={event => this.props.setProject(this.props.project.setEntity(
							this.state.selectedEntityIndex,
							selectedEntity.setName(event.target.value),
						))}
					/>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label md={2}>Width</Label>
				<Col md={10}>
					<Input
						value={selectedEntity.data.width}
						onChange={event => {
							const width = Number(event.target.value);
							if (!isNaN(width) && width > 0)
								this.props.setProject(this.props.project.setEntity(
									this.state.selectedEntityIndex,
									selectedEntity.setWidth(width),
								));
						}}
					/>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label md={2}>Height</Label>
				<Col md={10}>
					<Input
						value={selectedEntity.data.height}
						onChange={event => {
							const height = Number(event.target.value);
							if (!isNaN(height) && height > 0)
								this.props.setProject(this.props.project.setEntity(
									this.state.selectedEntityIndex,
									selectedEntity.setHeight(height),
								));
						}}
					/>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label md={2}>Color</Label>
				<Col md={10}>
					<Input
						type='color'
						value={selectedEntity.data.color}
						onChange={event => this.props.setProject(this.props.project.setEntity(
							this.state.selectedEntityIndex,
							selectedEntity.setColor(event.target.value),
						))}
					/>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label md={2}>Image path</Label>
				<Col md={10}>
					<InputGroup>
						<InputGroupAddon addonType='prepend'>
							<Button
								onClick={() => this.chooseEntityImage()}
							>
								<FontAwesomeIcon icon={faFolderOpen} />
							</Button>
						</InputGroupAddon>
						<InputGroupAddon addonType='prepend'>
							<Button
								onClick={() => this.props.setProject(this.props.project.setEntity(
									this.state.selectedEntityIndex,
									selectedEntity.clearImagePath(),
								))}
							>
								<FontAwesomeIcon icon={faEraser} />
							</Button>
						</InputGroupAddon>
						<Input
							disabled
							value={selectedEntity.data.imagePath || ''}
						/>
					</InputGroup>
				</Col>
			</FormGroup>
		</Form>;
	}

	private renderParameterEditorForm() {
		const selectedEntity = this.props.project.data.entities[this.state.selectedEntityIndex];
		const selectedParameter = selectedEntity.data.parameters[this.state.selectedParameterIndex];
		if (!(selectedEntity && selectedParameter)) return <div />;
		return <Form>
			<FormGroup row>
				<Label md={2}>Name</Label>
				<Col md={10}>
					<Input
						value={selectedParameter.data.name}
						onChange={event => {
							this.props.setProject(
								this.props.project.setEntity(
									this.state.selectedEntityIndex,
									selectedEntity.setParameter(
										this.state.selectedParameterIndex,
										selectedParameter.setName(event.target.value),
									),
								),
							);
						}}
					/>
				</Col>
			</FormGroup>
			<FormGroup check>
				<Label check>
					<Input
						type='checkbox'
						checked={selectedParameter.data.default}
						onChange={event => {
							this.props.setProject(
								this.props.project.setEntity(
									this.state.selectedEntityIndex,
									selectedEntity.setParameter(
										this.state.selectedParameterIndex,
										selectedParameter.toggleDefault(),
									),
								),
							);
						}}
					/>
					Enabled by default
				</Label>
			</FormGroup>
		</Form>;
	}

	public render() {
		const selectedEntity = this.props.project.data.entities[this.state.selectedEntityIndex];
		return <Row>
			<Col md={4}>
				{this.renderSidebar()}
			</Col>
			{selectedEntity && <Col
				md={8}
				style={{
					height: 'calc(100vh - 194px)',
					overflowY: 'auto',
				}}
			>
				<TabContent activeTab={this.state.activeTab}>
					<TabPane tabId={EntityEditorTab.Entities}>
						{this.renderEntityEditorForm()}
					</TabPane>
					<TabPane tabId={EntityEditorTab.Parameters}>
						{this.renderParameterEditorForm()}
					</TabPane>
				</TabContent>
			</Col>}
		</Row>;
	}
}
