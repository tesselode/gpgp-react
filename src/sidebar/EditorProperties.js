import React from 'react';
import { Form, FormGroup, Label, Input, ButtonGroup, Button } from 'reactstrap';
import { GridModes } from '../editor/Editor';
import SidebarSection from './SidebarSection';

const EditorProperties = (props) =>
	<SidebarSection title='Editor properties'>
		<Form>
			<FormGroup>
				<Label size='sm'>Show grid</Label>
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
		</Form>
	</SidebarSection>

export default EditorProperties;
