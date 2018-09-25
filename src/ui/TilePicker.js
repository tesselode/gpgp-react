import React, { Component } from 'react';
import SidebarSection from './SidebarSection';
import Editor from '../editor/Editor';

export default class TilePicker extends Component {
	render() {
		let tileset = this.props.project.tilesets[this.props.tileset];
		return(<SidebarSection title={'Tiles (' + this.props.tileset + ')'}>
			<Editor
				width='22.5vw'
				height='33vh'
				startingZoom={.5}
				mapWidth={tileset.imageWidth / tileset.tileSize}
				mapHeight={tileset.imageHeight / tileset.tileSize}
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
