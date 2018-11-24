import Octicon, { FileDirectory, X } from '@githubprimer/octicons-react';
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
import { getUniqueId } from '../../util';
import ColorDisplay from '../common/color-display';
import ItemList from './item-list';

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
	showColorPicker: boolean;
	uniqueId: number;
}

export default class ProjectEntitiesTab extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: EntityEditorTab.Entities,
			selectedEntityIndex: 0,
			showColorPicker: false,
			uniqueId: getUniqueId(),
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

	public render() {
		const selectedEntity = this.props.project.data.entities[this.state.selectedEntityIndex];
		return <Row>
			<Col md={4}>
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
						<ItemList
							title='Entities'
							selectedItemIndex={this.state.selectedEntityIndex}
							items={this.props.project.data.entities}
							onSelectItem={entityIndex => this.setState({selectedEntityIndex: entityIndex})}
							onAddItem={() => this.props.setProject(this.props.project.addEntity())}
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
						/>
					</TabPane>
					<TabPane tabId={EntityEditorTab.Parameters}>
						<ItemList
							title='Parameters'
							addMenuItems={['Boolean']}
							selectedItemIndex={this.state.selectedEntityIndex}
							items={this.props.project.data.entities}
							onSelectItem={entityIndex => this.setState({selectedEntityIndex: entityIndex})}
							onAddItem={() => this.props.setProject(this.props.project.addEntity())}
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
						/>
					</TabPane>
				</TabContent>
			</Col>
			{selectedEntity && <Col
				md={8}
				key={this.state.selectedEntityIndex}
				style={{
					height: 'calc(100vh - 194px)',
					overflowY: 'auto',
				}}
			>
				<Form>
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
										<Octicon icon={FileDirectory} />
									</Button>
								</InputGroupAddon>
								<InputGroupAddon addonType='prepend'>
									<Button
										onClick={() => this.props.setProject(this.props.project.setEntity(
											this.state.selectedEntityIndex,
											selectedEntity.clearImagePath(),
										))}
									>
										<Octicon icon={X} />
									</Button>
								</InputGroupAddon>
								<Input
									disabled
									value={selectedEntity.data.imagePath || ''}
								/>
							</InputGroup>
						</Col>
					</FormGroup>
				</Form>
			</Col>}
		</Row>;
	}
}
