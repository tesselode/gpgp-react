import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import Level from '../../data/Level';
import SidebarSection from './SidebarSection';
import HistoryList from '../../data/HistoryList';

export interface Props {
	historyList: HistoryList<Level>;
	onHistoryPositionChanged: (position: number) => void;
}

export default (props: Props) => {
	let items: Array<JSX.Element> = [];
	for (let i = props.historyList.steps.length - 1; i >= 0; i--) {
		const step = props.historyList.steps[i];
		items.push(<ListGroupItem
			key={i}
			active={props.historyList.position === i}
			onClick={() => props.onHistoryPositionChanged(i)}
		>
			{step.description}
		</ListGroupItem>)
	}
	return <SidebarSection
		name='History'
		flush
	>
		<ListGroup flush>
			{items}
		</ListGroup>
	</SidebarSection>;
}
