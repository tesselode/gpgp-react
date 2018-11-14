import React from 'react';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import TileLayer from '../../../data/layer/tile-layer';
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
	/** A function that adds a new level state to the history. */
	modifyLevel: (level: Level, description: string, continuedAction?: boolean) => void;
	/** A function that is called when an input is blurred. */
	onBlur: () => void;
}

/** A form for changing a layer's settings. */
export default (props: Props) => {
	const selectedLayer = props.level.data.layers[props.selectedLayerIndex];
	return <SidebarSection
		name='Layer options'
	>
		<Form>
			<FormGroup>
				<Label size='sm'>Layer name</Label>
				<Input
					bsSize='sm'
					value={selectedLayer.data.name}
					onChange={event => {
						props.modifyLevel(
							props.level.setLayer(
								props.selectedLayerIndex,
								selectedLayer.setName(event.target.value),
							),
							'Rename layer to "' + event.target.value + '"',
							true,
						);
					}}
					onBlur={() => props.onBlur()}
				/>
			</FormGroup>
			{selectedLayer instanceof TileLayer && <FormGroup>
				<Label size='sm'>Tileset</Label>
				<Input
					bsSize='sm'
					type='select'
					value={selectedLayer.data.tilesetName}
					onChange={event => {
						props.modifyLevel(
							props.level.setLayer(
								props.selectedLayerIndex,
								selectedLayer.setTilesetName(event.target.value),
							),
							'Set ' + selectedLayer.data.name + ' tileset to ' + event.target.value,
						);
					}}
				>
					{props.project.data.tilesets.map((tileset, i) => <option
						key={i}
					>
						{tileset.data.name}
					</option>)}
				</Input>
			</FormGroup>}
		</Form>
	</SidebarSection>;
};
