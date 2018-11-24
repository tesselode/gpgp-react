import Octicon, { ArrowDown, ArrowUp, Plus, Trashcan } from '@githubprimer/octicons-react';
import React from 'react';
import { Button, DropdownMenu, DropdownToggle, ListGroupItem, Navbar, UncontrolledButtonDropdown } from 'reactstrap';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import ListGroup from 'reactstrap/lib/ListGroup';
import NavbarBrand from 'reactstrap/lib/NavbarBrand';

interface Props<T> {
	title: string;
	addMenuItems?: string[];
	selectedItemIndex: number;
	items: T[];
	// for now the item list is only used in the project editor, so i'm going to assume a default of 250px
	heightOffset?: number;
	onSelectItem: (itemIndex: number) => void;
	onAddItem: (itemIndex?: number) => void;
	onRemoveItem: (itemIndex: number) => void;
	onMoveItemUp: (itemIndex: number) => void;
	onMoveItemDown: (itemIndex: number) => void;
	renderItem: (item: T, itemIndex: number) => JSX.Element | string;
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
				{props.addMenuItems ? <UncontrolledButtonDropdown>
					<DropdownToggle><Octicon icon={Plus}/></DropdownToggle>
					<DropdownMenu>
						{props.addMenuItems.map((label, i) => <DropdownItem
							key={i}
							onClick={() => {
								props.onAddItem(i);
								props.onSelectItem(Math.max(props.selectedItemIndex, 0));
							}}
						>
							{label}
						</DropdownItem>)}
					</DropdownMenu>
				</UncontrolledButtonDropdown> : <Button
					onClick={() => {
						props.onAddItem();
						props.onSelectItem(Math.max(props.selectedItemIndex, 0));
					}}
				>
					<Octicon icon={Plus}/>
				</Button>}
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
		<ListGroup
			flush
			style={{
				maxHeight: 'calc(100vh - ' + (props.heightOffset || 250) + 'px)',
				overflowY: 'auto',
			}}
		>
			{props.items.map((item, i) =>
				<ListGroupItem
					key={i}
					active={i === props.selectedItemIndex}
					onClick={() => {props.onSelectItem(i); }}
				>
					{props.renderItem(item, i)}
				</ListGroupItem>)
			}
		</ListGroup>
	</div>;
}
