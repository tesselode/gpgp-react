import React from 'react';
import { GridTool } from '../../grid';
import { ButtonGroup } from 'reactstrap';
import Button from 'reactstrap/lib/Button';
import Octicon, { Pencil, PrimitiveSquare } from '@githubprimer/octicons-react';

export interface Props {
	tool: GridTool;
	onToolChanged: (tool: GridTool) => void;
}

export default (props: Props) => <div
	style={{
		marginBottom: '1em',
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
</div>
