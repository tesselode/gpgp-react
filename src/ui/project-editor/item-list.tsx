import Octicon, { ArrowDown, ArrowUp, Plus, Trashcan } from '@githubprimer/octicons-react';
import React from 'react';
import { Button, ListGroupItem, Navbar } from 'reactstrap';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';
import ListGroup from 'reactstrap/lib/ListGroup';
import NavbarBrand from 'reactstrap/lib/NavbarBrand';

export interface Props<T> {
	title: string;
	selectedItemIndex: number;
	items: T[];
	onSelectItem: (itemIndex: number) => void;
	onAddItem: () => void;
	onRemoveItem: (itemIndex: number) => void;
	onMoveItemUp: (itemIndex: number) => void;
	onMoveItemDown: (itemIndex: number) => void;
	renderItem: (item: T) => JSX.Element | string;
}

export default function ItemList<T>(props: Props<T>) {
	const selectedItem = props.items[props.selectedItemIndex];
	return <div>
		<Navbar color='light'>
			<NavbarBrand>{props.title}</NavbarBrand>
			<ButtonGroup>
				<Button
					disabled={!selectedItem}
					onClick={() => {
						props.onRemoveItem(props.selectedItemIndex);
						props.onSelectItem(Math.min(props.selectedItemIndex, props.items.length - 2));
					}}
				>
					<Octicon icon={Trashcan}/>
				</Button>
				<Button
					onClick={() => {
						props.onAddItem();
						props.onSelectItem(Math.max(props.selectedItemIndex, 0));
					}}
				>
					<Octicon icon={Plus}/>
				</Button>
				<Button
					disabled={!(selectedItem && props.selectedItemIndex !== 0)}
					onClick={() => {
						props.onMoveItemUp(props.selectedItemIndex);
						props.onSelectItem(props.selectedItemIndex - 1);
					}}
				>
					<Octicon icon={ArrowUp}/>
				</Button>
				<Button
					disabled={!(selectedItem && props.selectedItemIndex !== props.items.length - 1)}
					onClick={() => {
						props.onMoveItemDown(props.selectedItemIndex);
						props.onSelectItem(props.selectedItemIndex + 1);
					}}
				>
					<Octicon icon={ArrowDown}/>
				</Button>
			</ButtonGroup>
		</Navbar>
		<ListGroup flush>
			{props.items.map((item, i) =>
				<ListGroupItem
					key={i}
					active={i === props.selectedItemIndex}
					onClick={() => {props.onSelectItem(i); }}
				>
					{props.renderItem(item)}
				</ListGroupItem>)
			}
		</ListGroup>
	</div>;
}
