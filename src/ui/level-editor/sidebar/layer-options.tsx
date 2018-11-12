import React from 'react';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { isTileLayer } from '../../../data/layer/tile-layer';
import Level from '../../../data/level';
import Project from '../../../data/project';
import SidebarSection from './sidebar-section';

export interface Props {
	/** The currently opened level. */
	level: Level;
	/** The project the level belongs to. */
	project: Project;
	/** The number of the selected layer. */
	selectedLayerIndex: number;
	/** A function that is called when the level is modified. Returns the description of the action taken. */
	modifyLevel: (f: (level: Level) => string | false, continuedAction?: boolean) => void;
	/** A function that is called when an input is blurred. */
	onBlur: () => void;
}

/** A form for changing a layer's settings. */
export default (props: Props) => {
	const selectedLayer = props.level.layers[props.selectedLayerIndex];
	return <SidebarSection
		name='Layer options'
	>
		<Form>
			<FormGroup>
				<Label size='sm'>Layer name</Label>
				<Input
					bsSize='sm'
					value={selectedLayer.name}
					onChange={event => props.modifyLevel(level => {
						level.layers[props.selectedLayerIndex].name = event.target.value;
						return 'Rename layer to "' + event.target.value + '"';
					}, true)}
					onBlur={() => props.onBlur()}
				/>
			</FormGroup>
			{isTileLayer(selectedLayer) && <FormGroup>
				<Label size='sm'>Tileset</Label>
				<Input
					bsSize='sm'
					type='select'
					value={selectedLayer.tilesetName}
					onChange={event => props.modifyLevel(level => {
						const layer = level.layers[props.selectedLayerIndex];
						if (isTileLayer(layer)) {
							layer.tilesetName = event.target.value;
							return 'Set ' + layer.name + ' tileset to ' + layer.tilesetName;
						}
					})}
				>
					{props.project.tilesets.map((tileset, i) => <option
						key={i}
					>
						{tileset.name}
					</option>)}
				</Input>
			</FormGroup>}
		</Form>
	</SidebarSection>;
};
