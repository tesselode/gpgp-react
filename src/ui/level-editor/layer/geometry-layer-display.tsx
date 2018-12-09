import React from 'react';
import GeometryLayer from '../../../data/level/layer/geometry-layer';
import Project from '../../../data/project/project';

interface Props {
    project: Project;
    layer: GeometryLayer;
}

const GeometryLayerDisplay = (props: Props) =>
    class extends React.Component<Props & {context: CanvasRenderingContext2D}> {
        public render() {
            console.log('rendering!')
            const tileSize = props.project.data.tileSize;
            this.props.context.fillStyle = 'rgba(39, 187, 232, .33)';
            for (const item of props.layer.data.items) {
                this.props.context.fillRect(item.x * tileSize, item.y * tileSize, tileSize, tileSize);
            }
            return null;
        }
    };

export default GeometryLayerDisplay;
