import { faEdit, faSquare, faStamp, faTh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ButtonGroup, Navbar } from 'reactstrap';
import Button from 'reactstrap/lib/Button';
import { EditTool } from '../edit-tool';

export interface Props {
	isTileLayerSelected: boolean;
	tool: EditTool;
	hideGrid: boolean;
	onToolChanged: (tool: EditTool) => void;
	onToggleGrid: () => void;
}

export default (props: Props) => <div
	style={{
		position: 'sticky',
		top: 0,
		zIndex: 100,
		paddingTop: '.5em',
		paddingBottom: '1em',
		background: 'white',
	}}
>
	<Navbar style={{padding: 0}}>
		<ButtonGroup>
			<Button
				active={props.tool === EditTool.Pencil}
				onClick={() => props.onToolChanged(EditTool.Pencil)}
			>
				<FontAwesomeIcon icon={faEdit} />
			</Button>
			<Button
				active={props.tool === EditTool.Rectangle}
				onClick={() => props.onToolChanged(EditTool.Rectangle)}
			>
				<FontAwesomeIcon icon={faSquare} />
			</Button>
			<Button
				active={props.tool === EditTool.Stamp}
				onClick={() => props.onToolChanged(EditTool.Stamp)}
			>
				<FontAwesomeIcon icon={faStamp} />
			</Button>
		</ButtonGroup>
		<Button
			active={!props.hideGrid}
			onClick={() => props.onToggleGrid()}
		>
			<FontAwesomeIcon icon={faTh} />
		</Button>
	</Navbar>
</div>;
;
