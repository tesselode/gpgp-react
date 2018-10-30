import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import SidebarSection from './sidebar-section';

export interface Props {
	levelHistoryDescriptions: string[];
	levelHistoryPosition: number;
	onHistoryPositionChanged: (position: number) => void;
}

export default (props: Props) => {
	const items: JSX.Element[] = [];
	for (let i = props.levelHistoryDescriptions.length - 1; i >= 0; i--) {
		items.push(<ListGroupItem
			key={i}
			active={props.levelHistoryPosition === i}
			onClick={() => props.onHistoryPositionChanged(i)}
			className='compact-list-group-item'
		>
			{props.levelHistoryDescriptions[i]}
		</ListGroupItem>);
	}
	return <SidebarSection
		name='History'
		flush
	>
		<ListGroup flush>
			{items}
		</ListGroup>
	</SidebarSection>;
};
