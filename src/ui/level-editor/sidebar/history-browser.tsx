import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import HistoryList from '../../../data/history-list';
import Level from '../../../data/level';
import SidebarSection from './sidebar-section';

export interface Props {
	historyList: HistoryList<Level>;
	onHistoryPositionChanged: (position: number) => void;
}

export default (props: Props) => {
	const items: JSX.Element[] = [];
	for (let i = props.historyList.steps.length - 1; i >= 0; i--) {
		const step = props.historyList.steps[i];
		items.push(<ListGroupItem
			key={i}
			active={props.historyList.position === i}
			onClick={() => props.onHistoryPositionChanged(i)}
			className='compact-list-group-item'
		>
			{step.description}
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
