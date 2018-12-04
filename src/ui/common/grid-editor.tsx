import React from 'react';
import Level from '../../data/level/level';
import Project from '../../data/project/project';

interface Props {
    viewportWidth: number;
    viewportHeight: number;
    project: Project;
    level: Level;
}

interface State {
    mouseX: number;
    mouseY: number;
    panX: number;
    panY: number;
    panning: boolean;
}

export default class GridEditor extends React.Component<Props, State> {
    private canvasRef = React.createRef<HTMLCanvasElement>();

    constructor(props) {
        super(props);
        this.state = {
            mouseX: 0,
            mouseY: 0,
            panX: 0,
            panY: 0,
            panning: false,
        };
    }

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
        const tileSize = this.props.project.data.tileSize;
        const width = this.props.level.data.width;
        const height = this.props.level.data.height;
        const canvas = this.canvasRef.current;
        canvas.width = this.props.viewportWidth;
        canvas.height = this.props.viewportHeight;
        const context = canvas.getContext('2d');
        context.translate(this.props.viewportWidth / 2, this.props.viewportHeight / 2);
        context.translate(-(width * tileSize) / 2, -(height * tileSize) / 2);
        context.translate(this.state.panX, this.state.panY);
        this.renderGridlines(context);
    }

    public componentDidMount() {
        this.renderCanvas();
    }

    public componentWillUpdate() {
        this.renderCanvas();
    }

    public render() {
        return <canvas
            ref={this.canvasRef}
            onMouseDown={event => {
                switch (event.button) {
                    case 1:
                        this.setState({panning: true});
                }
            }}
            onMouseUp={event => {
                switch (event.button) {
                    case 1:
                        this.setState({panning: false});
                }
            }}
            onMouseMove={event => {
                if (this.state.panning)
                    this.setState({
                        panX: this.state.panX + event.clientX - this.state.mouseX,
                        panY: this.state.panY + event.clientY - this.state.mouseY,
                    });
                this.setState({
                    mouseX: event.clientX,
                    mouseY: event.clientY,
                });
            }}
        />;
    }
}
