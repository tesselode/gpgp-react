import React from 'react';
import {
	Form,
	FormGroup,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Label,
} from 'reactstrap';
import Level from '../../../data/level/level';
import { getUniqueId } from '../../../util';
import SidebarSection from './sidebar-section';

export interface Props {
	/** The currently opened level. */
	level: Level;
	/** A function that adds a new level state to the history. */
	modifyLevel: (level: Level, description: string, continuedAction?: boolean) => void;
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
							value={this.props.level.data.width}
							onChange={event => {
								const width = Number(event.target.value);
								if (!isNaN(width) && width > 0)
									this.props.modifyLevel(
										this.props.level.setWidth(width),
										'Change level width',
										true,
									);
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
							value={this.props.level.data.height}
							onChange={event => {
								const height = Number(event.target.value);
								if (!isNaN(height) && height > 0)
									this.props.modifyLevel(
										this.props.level.setHeight(height),
										'Change level height',
										true,
									);
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
									checked={this.props.level.data.hasBackgroundColor}
									onChange={() => {
										this.props.modifyLevel(
											this.props.level.toggleHasBackgroundColor(),
											this.props.level.data.hasBackgroundColor ? 'Disable background color' :
												'Enable background color',
										);
									}}
								/>
							</InputGroupText>
						</InputGroupAddon>
						<Input
							type='color'
							value={this.props.level.data.backgroundColor}
							onChange={event => {
								this.props.modifyLevel(
									this.props.level.setBackgroundColor(event.target.value),
									'Change background color to ' + event.target.value,
								);
							}}
						/>
					</InputGroup>
				</FormGroup>
			</Form>
		</SidebarSection>;
	}
}
