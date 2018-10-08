import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import HistoryManager from '../../data/HistoryManager';
import Level from '../../data/Level';
import SidebarSection from './SidebarSection';

export interface Props {
	historyManager: HistoryManager<Level>;
}

export default (props: Props) =>
	<SidebarSection
		name='History'
		flush
	>
		<ListGroup flush>
			{props.historyManager.steps.map((step, i) => 
				<ListGroupItem
					active={props.historyManager.position === i}
				>
					{step.description}
				</ListGroupItem>
			)}
		</ListGroup>
	</SidebarSection>
