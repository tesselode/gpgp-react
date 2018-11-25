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
import SidebarSection from './sidebar-section';

export interface Props {
	/** The currently opened level. */
	level: Level;
	/** A function that adds a new level state to the history. */
	modifyLevel: (level: Level, description: string, continuedAction?: boolean) => void;
	/** A function that is called when an input is blurred. */
	onBlur: () => void;
}

/** A form for changing a level's options. */
const LevelOptions = (props: Props) => <SidebarSection
	name='Level options'
>
	<Form>
		<FormGroup>
			<Label size='sm'>Level width</Label>
			<InputGroup size='sm'>
				<Input
					type='number'
					value={props.level.data.width}
					onChange={event => {
						const width = Number(event.target.value);
						if (!isNaN(width) && width > 0)
							props.modifyLevel(
								props.level.setWidth(width),
								'Change level width',
								true,
							);
					}}
					onBlur={() => props.onBlur()}
				/>
				<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
			</InputGroup>
		</FormGroup>
		<FormGroup>
			<Label size='sm'>Level height</Label>
			<InputGroup size='sm'>
				<Input
					type='number'
					value={props.level.data.height}
					onChange={event => {
						const height = Number(event.target.value);
						if (!isNaN(height) && height > 0)
							props.modifyLevel(
								props.level.setHeight(height),
								'Change level height',
								true,
							);
					}}
					onBlur={() => props.onBlur()}
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
							checked={props.level.data.hasBackgroundColor}
							onChange={() => {
								props.modifyLevel(
									props.level.toggleHasBackgroundColor(),
									props.level.data.hasBackgroundColor ? 'Disable background color' :
										'Enable background color',
								);
							}}
						/>
					</InputGroupText>
				</InputGroupAddon>
				<Input
					type='color'
					value={props.level.data.backgroundColor}
					onChange={event => {
						props.modifyLevel(
							props.level.setBackgroundColor(event.target.value),
							'Change background color to ' + event.target.value,
						);
					}}
				/>
			</InputGroup>
		</FormGroup>
	</Form>
</SidebarSection>;

export default LevelOptions;
