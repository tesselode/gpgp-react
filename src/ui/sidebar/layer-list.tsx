import React from 'react';
import { Button, ButtonGroup, ListGroup, ListGroupItem } from "reactstrap";
import GeometryLayer from '../../data/layer/geometry-layer';
import Level from "../../data/level";
import SidebarSection from './sidebar-section';

interface Props {
	level: Level;
	selectedLayerIndex: number;
	onSelectLayer: (layerIndex: number) => void;
	onAddLayer: (layerIndex: number, layer: GeometryLayer) => void;
}

const LayerList = (props: Props) => <SidebarSection
	title='Layers'
	flush
	headerContent={<ButtonGroup
		size='sm'
	>
		<Button
			onClick={() => {
				props.onAddLayer(
					props.selectedLayerIndex,
					GeometryLayer.New(),
				);
			}}
		>
			+
		</Button>
	</ButtonGroup>}
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
