import Octicon, { Pencil, PrimitiveSquare } from '@githubprimer/octicons-react';
import React from 'react';
import { ButtonGroup } from 'reactstrap';
import Button from 'reactstrap/lib/Button';
import { GridTool } from '../../grid';

export interface Props {
	tool: GridTool;
	onToolChanged: (tool: GridTool) => void;
}

export default (props: Props) => <div
	style={{
		position: 'sticky',
		top: 0,
		zIndex: 100,
		paddingBottom: '1em',
		background: 'white',
	}}
>
	<ButtonGroup>
		<Button
			active={props.tool === GridTool.Pencil}
			onClick={() => props.onToolChanged(GridTool.Pencil)}
		>
			<Octicon icon={Pencil} />
		</Button>
		<Button
			active={props.tool === GridTool.Rectangle}
			onClick={() => props.onToolChanged(GridTool.Rectangle)}
		>
			<Octicon icon={PrimitiveSquare} />
		</Button>
	</ButtonGroup>
</div>;
