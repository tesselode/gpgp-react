import Octicon, { Paintcan } from '@githubprimer/octicons-react';
import React from 'react';
import { SketchPicker } from 'react-color';
import {
	Button,
	Form,
	FormGroup,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Label,
	Popover,
} from 'reactstrap';
import Level from '../../../data/level';
import { getUniqueId } from '../../../util';
import ColorDisplay from '../../common/color-display';
import SidebarSection from './sidebar-section';

export interface Props {
	/** The currently opened level. */
	level: Level;
	/** A function that is called when the level is modified. Returns the description of the action taken. */
	modifyLevel: (f: (level: Level) => string | false, continuedAction?: boolean) => void;
	/** A function that is called when an input is blurred. */
	onBlur: () => void;
}

export interface State {
	/** Whether the color picker is currently being shown. */
	showColorPicker: boolean;
	/** A unique ID that distinguishes this element from all others. */
	uniqueId: number;
}

/** A form for changing a level's options. */
export default class LevelOptions extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			showColorPicker: false,
			uniqueId: getUniqueId(),
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
									}, true);
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
									}, true);
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
								id={'showColorPicker' + this.state.uniqueId.toString()}
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
					<Popover
						placement='bottom'
						target={'showColorPicker' + this.state.uniqueId.toString()}
						isOpen={this.state.showColorPicker}
						toggle={() => this.setState({showColorPicker: !this.state.showColorPicker})}
					>
						<SketchPicker
							color={this.props.level.backgroundColor}
							onChangeComplete={color => this.props.modifyLevel(level => {
								level.backgroundColor = color.hex;
								return 'Change background color to ' + color.hex;
							})}
							disableAlpha
						/>
					</Popover>
				</FormGroup>
			</Form>
		</SidebarSection>;
	}
}
