import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import SidebarSection from './SidebarSection';

const History = (props) => {
	let historyItems = [];
	for (let i = props.history.length - 1; i >= 0; i--) {
		historyItems.push(props.history[i]);
	}

	return <SidebarSection
		title={'History'}
		flush
	>
		<ListGroup>
			{historyItems.map((state, i) =>
				<ListGroupItem
					key={i}
					active={props.historyPosition === historyItems.length - 1 - i}
					onClick={() => props.onHistoryPositionChanged(historyItems.length - 1 - i)}
				>
					{state.description}
				</ListGroupItem>)
			}
		</ListGroup>
	</SidebarSection>;
}

export default History;
