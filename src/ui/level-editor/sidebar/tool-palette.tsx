import Octicon, { Pencil, PrimitiveSquare } from '@githubprimer/octicons-react';
import React from 'react';
import { ButtonGroup, Navbar } from 'reactstrap';
import Button from 'reactstrap/lib/Button';
import { EditTool } from '../edit-tool';

export interface Props {
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
				<Octicon icon={Pencil} />
			</Button>
			<Button
				active={props.tool === EditTool.Rectangle}
				onClick={() => props.onToolChanged(EditTool.Rectangle)}
			>
				<Octicon icon={PrimitiveSquare} />
			</Button>
		</ButtonGroup>
		<Button
			active={!props.hideGrid}
			onClick={() => props.onToggleGrid()}
		>
			G
		</Button>
	</Navbar>
</div>;
