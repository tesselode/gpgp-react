import React, { Component } from 'react';
import SidebarSection from './SidebarSection';
import Editor from '../editor/Editor';

export default class TilePicker extends Component {
	render() {
		return(<SidebarSection title={'Tiles (' + this.props.tilesetName + ')'}>
			<Editor
				width='22.5vw'
				height='50vh'
				startingZoom={.5}
				mapWidth={this.props.tileset.imageWidth / this.props.tileset.tileSize}
				mapHeight={this.props.tileset.imageHeight / this.props.tileset.tileSize}
				project={this.props.project}
				layers={[
					{
						name: 'Tileset',
						type: 'tilePreview',
						tileset: this.props.tileset,
					},
				]}
				onPlace={() => {}}
				onRemove={() => {}}
			/>
		</SidebarSection>);
	}
}
