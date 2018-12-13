import React from 'react';
import GeometryLayer from '../../../data/level/layer/geometry-layer';
import Project from '../../../data/project/project';
import Level from '../../../data/level/level';

interface Props {
    project: Project;
    level: Level;
    layer: GeometryLayer;
    context?: CanvasRenderingContext2D;
}

export default class GeometryLayerDisplay extends React.Component<Props> {
    private canvas = document.createElement('canvas');

    constructor(props) {
        super(props);
        this.initCanvas(props);
    }

    private initCanvas(props: Props) {
        const tileSize = props.project.data.tileSize;
        this.canvas.width = props.level.data.width * tileSize;
        this.canvas.height = props.level.data.height * tileSize;
        const context = this.canvas.getContext('2d');
        context.fillStyle = 'rgba(39, 187, 232, .33)';
        props.layer.data.items.forEach(item => {
            context.fillRect(item.x * tileSize, item.y * tileSize, tileSize, tileSize);
        });
    }

    public shouldComponentUpdate(nextProps: Props) {
        if (nextProps.level.data.width !== this.props.level.data.width ||
                nextProps.level.data.height !== this.props.level.data.height) {
            this.initCanvas(nextProps);
            return true;
        }
        const context = this.canvas.getContext('2d');
        context.fillStyle = 'rgba(39, 187, 232, .33)';
        const tileSize = this.props.project.data.tileSize;
        // remove tiles
        this.props.layer.data.items.forEach(item => {
            if (!nextProps.layer.hasItemAt(item.x, item.y)) {
                context.clearRect(item.x * tileSize, item.y * tileSize, tileSize, tileSize);
                console.log('clearing');
            }
        });
        // place tiles
        nextProps.layer.data.items.forEach(item => {
            if (!this.props.layer.hasItemAt(item.x, item.y)) {
                context.fillRect(item.x * tileSize, item.y * tileSize, tileSize, tileSize);
                console.log('drawing');
            }
        });
        return true;
    }

    public render() {
        if (this.props.context)
            this.props.context.drawImage(this.canvas, 0, 0);
        return null;
    }
}
