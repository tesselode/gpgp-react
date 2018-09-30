import React from 'react';
import { Form, FormGroup, Input, Label, ButtonGroup, Button } from 'reactstrap';
import { GridModes } from '../level/GridEditor';
import SidebarSection from './SidebarSection';

const EditorProperties = (props) =>
	<SidebarSection title='Editor properties'>
		<Form>
			<Label size='sm'>Show grid</Label>
			<FormGroup>
				<ButtonGroup>
					<Button
						size='sm'
						disabled={props.gridMode === GridModes.OnTop}
						color={props.gridMode === GridModes.OnTop ? 'primary' : 'secondary'}
						onClick={() => props.onGridModeChanged(GridModes.OnTop)}
					>
						On top
					</Button>
					<Button
						size='sm'
						disabled={props.gridMode === GridModes.OnBottom}
						color={props.gridMode === GridModes.OnBottom ? 'primary' : 'secondary'}
						onClick={() => props.onGridModeChanged(GridModes.OnBottom)}
					>
						On bottom
					</Button>
					<Button
						size='sm'
						disabled={props.gridMode === GridModes.Hide}
						color={props.gridMode === GridModes.Hide ? 'primary' : 'secondary'}
						onClick={() => props.onGridModeChanged(GridModes.Hide)}
					>
						Hide
					</Button>
				</ButtonGroup>
			</FormGroup>

			<FormGroup check>
				<Label check size='sm'>
					<Input
						type='checkbox'
						checked={props.showSelectedLayerOnTop}
						onChange={(event) => props.onToggle()}
					/>
					Show selected layer on top
				</Label>
			</FormGroup>
		</Form>
	</SidebarSection>

export default EditorProperties;
