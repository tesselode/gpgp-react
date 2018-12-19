import React from 'react';
import { ListGroup, ListGroupItem } from "reactstrap";
import Level from "../../data/level";

interface Props {
	level: Level;
	selectedLayerIndex: number;
	onSelectLayer: (layerIndex: number) => void;
}

const LayerList = (props: Props) => <ListGroup
	flush
>
	{props.level.data.layers.map((layer, i) => <ListGroupItem
		key={i}
		active={props.selectedLayerIndex === i}
		onClick={() => {props.onSelectLayer(i); }}
		size='sm'
	>
		{layer.data.name}
	</ListGroupItem>)}
</ListGroup>;

export default LayerList;
