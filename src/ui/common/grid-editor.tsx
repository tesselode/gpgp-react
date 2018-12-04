import React from 'react';
import Level from '../../data/level/level';
import Project from '../../data/project/project';

export type GridEditorLayer = (context: CanvasRenderingContext2D) => void;

interface Props {
    viewportWidth: number;
    viewportHeight: number;
    project: Project;
    level: Level;
    layers?: GridEditorLayer[];
    onMoveCursor?: (x: number, y: number) => void;
}

interface State {
    mouseX: number;
    mouseY: number;
    panX: number;
    panY: number;
    zoom: number;
    panning: boolean;
    cursorX: number;
    cursorY: number;
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
            zoom: 2,
            panning: false,
            cursorX: 0,
            cursorY: 0,
        };
    }

    private getCursorPosition(x: number, y: number): {x: number, y: number} {
        const tileSize = this.props.project.data.tileSize;
        const width = this.props.level.data.width;
        const height = this.props.level.data.height;
        x -= this.props.viewportWidth / 2;
        y -= this.props.viewportHeight / 2;
        x -= this.state.panX;
        y -= this.state.panY;
        x /= this.state.zoom;
        y /= this.state.zoom;
        x /= tileSize;
        y /= tileSize;
        x += width / 2;
        y += height / 2;
        x = Math.floor(x);
        y = Math.floor(y);
        return {x, y};
    }

    private renderOutline(context: CanvasRenderingContext2D) {
        const tileSize = this.props.project.data.tileSize;
        const width = this.props.level.data.width;
        const height = this.props.level.data.height;
        context.strokeStyle = 'rgba(0, 0, 0, 1)';
        context.strokeRect(0, 0, width * tileSize, height * tileSize);
    }

    private renderGridlines(context: CanvasRenderingContext2D) {
        const tileSize = this.props.project.data.tileSize;
        const width = this.props.level.data.width;
        const height = this.props.level.data.height;
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
        context.translate(this.state.panX, this.state.panY);
        context.scale(this.state.zoom, this.state.zoom);
        context.translate(-(width * tileSize) / 2, -(height * tileSize) / 2);
        this.renderGridlines(context);
        if (this.props.layers) {
            this.props.layers.forEach(display => {
                display(context);
            });
        }
        this.renderOutline(context);
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
                const rect = this.canvasRef.current.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;
                if (this.state.panning)
                    this.setState({
                        panX: this.state.panX + mouseX - this.state.mouseX,
                        panY: this.state.panY + mouseY - this.state.mouseY,
                    });
                this.setState({
                    mouseX,
                    mouseY,
                });
                const cursorPosition = this.getCursorPosition(mouseX, mouseY);
                if (cursorPosition.x !== this.state.cursorX || cursorPosition.y !== this.state.cursorY) {
                    if (this.props.onMoveCursor)
                        this.props.onMoveCursor(cursorPosition.x, cursorPosition.y);
                }
                this.setState({
                    cursorX: cursorPosition.x,
                    cursorY: cursorPosition.y,
                });
            }}
            onWheel={event => {
                if (!event.ctrlKey) return;
                if (event.deltaY > 0) {
                    this.setState({zoom: this.state.zoom / 1.1});
                }
                if (event.deltaY < 0) {
                    this.setState({zoom: this.state.zoom * 1.1});
                }
            }}
        />;
    }
}
