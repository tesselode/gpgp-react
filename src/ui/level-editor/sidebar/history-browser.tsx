import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import HistoryList from '../../../data/history-list';
import SidebarSection from './sidebar-section';

export interface Props {
	/** The history to display. */
	history: HistoryList<any>;
	/** A function that is called when a history state is clicked. */
	onJump: (position: number) => void;
}

/** A listing of all of the steps of a history. Allows jumping to different steps. */
export default (props: Props) => {
	const items: JSX.Element[] = [];
	for (let i = props.history.steps.length - 1; i >= 0; i--) {
		items.push(<ListGroupItem
			key={i}
			active={props.history.position === i}
			onClick={() => props.onJump(i)}
			className='compact-list-group-item'
		>
			{props.history.steps[i].description}
		</ListGroupItem>);
	}
	return <SidebarSection
		name='History'
		height='20em'
		flush
	>
		<ListGroup flush>
			{items}
		</ListGroup>
	</SidebarSection>;
};
