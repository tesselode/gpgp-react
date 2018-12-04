import React from 'react';
import Level from '../../data/level/level';
import Project from '../../data/project/project';

interface Props {
    viewportWidth: number;
    viewportHeight: number;
    project: Project;
    level: Level;
}

export default class GridEditor extends React.Component<Props> {
    private canvasRef = React.createRef<HTMLCanvasElement>();

    private renderGridlines(context: CanvasRenderingContext2D) {
        const tileSize = this.props.project.data.tileSize;
        const width = this.props.level.data.width;
        const height = this.props.level.data.height;
        context.strokeStyle = 'rgba(0, 0, 0, 1)';
        context.strokeRect(0, 0, width * tileSize, height * tileSize);
        context.strokeStyle = 'rgba(0, 0, 0, .25)';
        for (let x = 1; x < width; x++) {
            context.beginPath();
            context.moveTo(x * tileSize, 0);
            context.lineTo(x * tileSize, height * tileSize);
            context.stroke();
        }
        for (let y = 1; y < height; y++) {
            context.beginPath();
            context.moveTo(0, y * tileSize);
            context.lineTo(width * tileSize, y * tileSize);
            context.stroke();
        }
    }

    private renderCanvas() {
        const canvas = this.canvasRef.current;
        canvas.width = this.props.viewportWidth;
        canvas.height = this.props.viewportHeight;
        const context = canvas.getContext('2d');
        this.renderGridlines(context);
    }

    public componentDidMount() {
        this.renderCanvas();
    }

    public componentWillUpdate() {
        this.renderCanvas();
    }

    public render() {
        return <canvas ref={this.canvasRef} />;
    }
}
