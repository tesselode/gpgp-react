import Octicon, { FileDirectory, Paintcan } from '@githubprimer/octicons-react';
import { remote } from 'electron';
import React from 'react';
import { SketchPicker } from 'react-color';
import { Button, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from 'reactstrap';
import Entity, { EntityParameterType } from '../../data/entity';
import ColorDisplay from './color-display';
import ParameterEditor from './entity-parameter-editor';
import ItemList from './item-list';

export interface Props {
	entity: Entity;
	selectedParameterIndex: number;
	onChangeEntityName: (name: string) => void;
	onChangeEntityColor: (color: string) => void;
	onChangeEntityWidth: (width: number) => void;
	onChangeEntityHeight: (height: number) => void;
	onChooseEntityImage: (imagePath: string) => void;
	onSelectParameter: (parameterIndex: number) => void;
	onAddParameter: () => void;
	onRemoveParameter: (parameterIndex: number) => void;
	onMoveParameterUp: (parameterIndex: number) => void;
	onMoveParameterDown: (parameterIndex: number) => void;
	onChangeParameterName: (parameterIndex: number, name: string) => void;
	onChangeParameterType: (parameterIndex: number, type: EntityParameterType) => void;
}

export interface State {
	showColorPicker: boolean;
}

export default class EntityEditor extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			showColorPicker: false,
		};
	}

	private chooseEntityImage(): void {
		remote.dialog.showOpenDialog({
			filters: [
				{name: 'Images', extensions: ['jpg', 'png']},
			],
		}, paths => {
			if (paths)
				this.props.onChooseEntityImage(paths[0]);
		});
	}

	public render() {
		return <div>
			<Form>
				<FormGroup row>
					<Label md={2}>Entity name</Label>
					<Col md={10}>
						<Input
							value={this.props.entity.name}
							onChange={(event) => this.props.onChangeEntityName(event.target.value)}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label md={2}>Size</Label>
					<Col md={10}>
						<InputGroup>
							<Input
								type='number'
								value={this.props.entity.width}
								onChange={event => {
									const value = Number(event.target.value);
									if (!isNaN(value) && value > 0)
										this.props.onChangeEntityWidth(value);
								}}
							/>
							<InputGroupAddon addonType='append'>
								<InputGroupText style={{borderRight: 'none'}}>x</InputGroupText>
							</InputGroupAddon>
							<Input
								type='number'
								value={this.props.entity.height}
								onChange={event => {
									const value = Number(event.target.value);
									if (!isNaN(value) && value > 0)
										this.props.onChangeEntityHeight(value);
								}}
							/>
							<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
						</InputGroup>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label md={2}>Color</Label>
					<Col md={10}>
						<InputGroup>
							<InputGroupAddon addonType='prepend'>
								<Button
									onClick={() => {this.setState({showColorPicker: !this.state.showColorPicker}); }}
								>
									<Octicon icon={Paintcan} />
								</Button>
								<InputGroupText>{ColorDisplay(this.props.entity.color)}</InputGroupText>
							</InputGroupAddon>
							<Input
								value={this.props.entity.color}
								disabled
							/>
						</InputGroup>
						{this.state.showColorPicker && <SketchPicker
							color={this.props.entity.color}
							onChangeComplete={color => this.props.onChangeEntityColor(color.hex)}
							disableAlpha
						/>}
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label md={2}>Image path</Label>
					<Col md={10}>
						<InputGroup>
							<InputGroupAddon addonType='prepend'>
								<Button
									onClick={this.chooseEntityImage.bind(this)}
								>
									<Octicon icon={FileDirectory} />
								</Button>
							</InputGroupAddon>
							<Input
								disabled
								value={this.props.entity.imagePath}
							/>
						</InputGroup>
					</Col>
				</FormGroup>
			</Form>
			<ItemList
				title='Parameters'
				selectedItemIndex={this.props.selectedParameterIndex}
				items={this.props.entity.parameters}
				onSelectItem={this.props.onSelectParameter}
				onAddItem={this.props.onAddParameter}
				onRemoveItem={this.props.onRemoveParameter}
				onMoveItemUp={this.props.onMoveParameterUp}
				onMoveItemDown={this.props.onMoveParameterDown}
				renderItem={(parameter, i) => <ParameterEditor
					parameter={parameter}
					selectedParameter={i === this.props.selectedParameterIndex}
					onChangeParameterName={name => this.props.onChangeParameterName(i, name)}
					onChangeParameterType={type => this.props.onChangeParameterType(i, type)}
				/>}
			/>
		</div>;
	}
}
