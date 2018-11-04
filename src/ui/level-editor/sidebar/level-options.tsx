import Octicon, { Paintcan } from '@githubprimer/octicons-react';
import React from 'react';
import { SketchPicker } from 'react-color';
import { Button, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from 'reactstrap';
import Level from '../../../data/level';
import ColorDisplay from '../../project-editor/color-display';
import SidebarSection from './sidebar-section';

export interface Props {
	level: Level;
	modifyLevel: (f: (level: Level) => string | false, continuedAction?: boolean) => void;
	onBlur: () => void;
}

export interface State {
	showColorPicker: boolean;
}

export default class LevelOptions extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			showColorPicker: false,
		};
	}

	public render() {
		return <SidebarSection
			name='Level options'
		>
			<Form>
				<FormGroup>
					<Label size='sm'>Level width</Label>
					<InputGroup size='sm'>
						<Input
							type='number'
							value={this.props.level.width}
							onChange={event => {
								const width = Number(event.target.value);
								if (!isNaN(width) && width > 0)
									this.props.modifyLevel(level => {
										level.width = width;
										return 'Change level width';
									});
							}}
							onBlur={() => this.props.onBlur()}
						/>
						<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
					</InputGroup>
				</FormGroup>
				<FormGroup>
					<Label size='sm'>Level height</Label>
					<InputGroup size='sm'>
						<Input
							type='number'
							value={this.props.level.height}
							onChange={event => {
								const height = Number(event.target.value);
								if (!isNaN(height) && height > 0)
									this.props.modifyLevel(level => {
										level.height = height;
										return 'Change level height';
									});
							}}
							onBlur={() => this.props.onBlur()}
						/>
						<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
					</InputGroup>
				</FormGroup>
				<FormGroup>
					<Label size='sm'>Background color</Label>
					<InputGroup size='sm'>
						<InputGroupAddon addonType='prepend'>
							<InputGroupText>
								<Input
									addon
									type='checkbox'
									checked={this.props.level.hasBackgroundColor}
									onChange={() => this.props.modifyLevel(level => {
										level.hasBackgroundColor = !level.hasBackgroundColor;
										return level.hasBackgroundColor ? 'Enable background color' :
											'Disable background color';
									})}
								/>
							</InputGroupText>
							<Button
								onClick={() => {this.setState({showColorPicker: !this.state.showColorPicker}); }}
							>
								<Octicon icon={Paintcan} />
							</Button>
							<InputGroupText>{ColorDisplay(this.props.level.backgroundColor)}</InputGroupText>
						</InputGroupAddon>
						<Input
							value={this.props.level.backgroundColor}
							disabled
						/>
					</InputGroup>
					{this.state.showColorPicker && <SketchPicker
						width='90%'
						color={this.props.level.backgroundColor}
						onChangeComplete={color => this.props.modifyLevel(level => {
							level.backgroundColor = color.hex;
							return 'Change background color to ' + color.hex;
						})}
						disableAlpha
					/>}
				</FormGroup>
			</Form>
		</SidebarSection>;
	}
}
