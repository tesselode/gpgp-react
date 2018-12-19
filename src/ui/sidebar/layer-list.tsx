import React from 'react';
import { ListGroup, ListGroupItem } from "reactstrap";
import Level from "../../data/level";
import SidebarSection from './sidebar-section';

interface Props {
	level: Level;
	selectedLayerIndex: number;
	onSelectLayer: (layerIndex: number) => void;
}

const LayerList = (props: Props) => <SidebarSection
	title='Layers'
	flush
>
	<ListGroup
		flush
		size='sm'
	>
		{props.level.data.layers.map((layer, i) => <ListGroupItem
			key={i}
			active={props.selectedLayerIndex === i}
			onClick={() => {props.onSelectLayer(i); }}
		>
			{layer.data.name}
		</ListGroupItem>)}
	</ListGroup>
</SidebarSection>;

export default LayerList;
