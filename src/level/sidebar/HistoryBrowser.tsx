import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import HistoryManager from '../../data/HistoryManager';
import Level from '../../data/Level';
import SidebarSection from './SidebarSection';

export interface Props {
	historyManager: HistoryManager<Level>;
}

export default (props: Props) => {
	let items: Array<JSX.Element> = [];
	for (let i = props.historyManager.steps.length - 1; i >= 0; i--) {
		const step = props.historyManager.steps[i];
		items.push(<ListGroupItem
			active={props.historyManager.position === i}
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
