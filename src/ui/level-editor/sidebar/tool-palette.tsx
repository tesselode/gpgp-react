import Octicon, { Pencil, PrimitiveSquare } from '@githubprimer/octicons-react';
import React from 'react';
import { ButtonGroup } from 'reactstrap';
import Button from 'reactstrap/lib/Button';
import { EditTool } from '../edit-tool';

export interface Props {
	tool: EditTool;
	onToolChanged: (tool: EditTool) => void;
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
</div>;
