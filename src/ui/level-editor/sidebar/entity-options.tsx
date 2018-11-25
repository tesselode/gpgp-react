import React from 'react';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import EntityLayer from '../../../data/level/layer/entity-layer';
import Level from '../../../data/level/level';
import BooleanParameter from '../../../data/project/entity/parameter/boolean-parameter';
import Project from '../../../data/project/project';
import SidebarSection from './sidebar-section';

export interface Props {
	/** The project for the currently opened level. */
	project: Project;
	/** The currently opened level. */
	level: Level;
	/** The number of the currently selected layer. */
	selectedLayerIndex: number;
	/** The number of the currently selected entity layer item. */
	selectedEntityItemIndex?: number;
	/** A function that adds a new level state to the history. */
	modifyLevel: (level: Level, description: string, continuedAction?: boolean) => void;
}

/** A form for modifying an entity layer item. */
const EntityOptions = (props: Props) => {
	const selectedLayer = props.level.data.layers[props.selectedLayerIndex];
	if (!(selectedLayer instanceof EntityLayer)) return <SidebarSection
		name='Entity options'
	>
		<Label size='sm' className='text-muted'>No entity layer selected</Label>
	</SidebarSection>;

	const selectedItem = selectedLayer.data.items[props.selectedEntityItemIndex];
	const entity = selectedItem && props.project.getEntity(selectedItem.entityName);
	if (!selectedItem) return <SidebarSection
		name='Entity options'
	>
		<Label size='sm' className='text-muted'>No entity selected</Label>
	</SidebarSection>;

	return <SidebarSection
		name={'Entity options - ' + entity.data.name}
		startExpanded
	>
		<Form>
			{entity.data.parameters.map(parameter => {
				if (parameter instanceof BooleanParameter)
					return <FormGroup check>
						<Label check size='sm'>
							<Input
								type='checkbox'
								checked={selectedItem.parameters[parameter.data.name]}
								onChange={event => {
									props.modifyLevel(
										props.level.setLayer(
											props.selectedLayerIndex,
											selectedLayer.setParameter(
												props.selectedEntityItemIndex,
												parameter.data.name,
												!selectedItem.parameters[parameter.data.name],
											),
										),
										'Toggle parameter "' + parameter.data.name + '"',
									);
								}}
							/>
							{parameter.data.name}
						</Label>
					</FormGroup>;
			})}
		</Form>
	</SidebarSection>;
};

export default EntityOptions;
