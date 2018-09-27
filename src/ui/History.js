import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import SidebarSection from './SidebarSection';

const History = (props) =>
	<SidebarSection
		title={'History'}
		flush
	>
		<ListGroup>
			{props.history.map((state, i) =>
				<ListGroupItem
					key={i}
					active={props.historyPosition === i}
				>
					{i}
				</ListGroupItem>)
			}
		</ListGroup>
	</SidebarSection>

export default History;
