import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import SidebarSection from './sidebar-section';

export interface Props {
	/** The list of descriptions of what action led to each history step. */
	historyDescriptions: string[];
	/** The current position in the history. */
	historyPosition: number;
	/** A function that is called when a history state is clicked. */
	onHistoryPositionChanged: (position: number) => void;
}

/** A listing of all of the steps of a history. Allows jumping to different steps. */
export default (props: Props) => {
	const items: JSX.Element[] = [];
	for (let i = props.historyDescriptions.length - 1; i >= 0; i--) {
		items.push(<ListGroupItem
			key={i}
			active={props.historyPosition === i}
			onClick={() => props.onHistoryPositionChanged(i)}
			className='compact-list-group-item'
		>
			{props.historyDescriptions[i]}
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
