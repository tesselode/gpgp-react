import React from 'react';
import { Stage } from '@inlet/react-pixi';

export type GridEditorLayer = (context: CanvasRenderingContext2D) => void;

interface Props {
    viewportWidth: number;
    viewportHeight: number;
    tileSize: number;
    width: number;
    height: number;
    hideGrid?: boolean;
    hasShadow?: boolean;
    backgroundColor?: string;
    layers?: GridEditorLayer[];
    /** A function that is called when the cursor is moved. */
	onMoveCursor?: (x: number, y: number) => void;
	/** A function that is called when the grid is clicked. */
	onClick?: (button: number) => void;
	/** A function that is called when a mouse button is released. */
	onRelease?: (button: number) => void;
	/** A function that is called when the grid is double-clicekd. */
	onDoubleClick?: (button: number) => void;
}

interface State {
    mouseX: number;
    mouseY: number;
    button: number | false;
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
            button: false,
            panX: 0,
            panY: 0,
            zoom: 2,
            panning: false,
            cursorX: 0,
            cursorY: 0,
        };
    }

    private getCursorPosition(x: number, y: number): {x: number, y: number} {
        const tileSize = this.props.tileSize;
        const width = this.props.width;
        const height = this.props.height;
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

    private renderBackground(context: CanvasRenderingContext2D) {
        const tileSize = this.props.tileSize;
        const width = this.props.width;
        const height = this.props.height;
        context.fillStyle = this.props.backgroundColor || 'rgba(255, 255, 255, 1)';
        if (this.props.hasShadow) {
            context.shadowColor = 'rgba(0, 0, 0, .33)';
            context.shadowBlur = 32;
            context.shadowOffsetX = 8;
            context.shadowOffsetY = 8;
        }
        context.fillRect(0, 0, width * tileSize, height * tileSize);
        context.shadowColor = 'rgba(0, 0, 0, 0)';
    }

    private renderOutline(context: CanvasRenderingContext2D) {
        const tileSize = this.props.tileSize;
        const width = this.props.width;
        const height = this.props.height;
        context.strokeStyle = 'rgba(0, 0, 0, 1)';
        context.strokeRect(0, 0, width * tileSize, height * tileSize);
    }

    private renderGridlines(context: CanvasRenderingContext2D) {
        const tileSize = this.props.tileSize;
        const width = this.props.width;
        const height = this.props.height;
        context.lineWidth = 1 / this.state.zoom;
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
        context.lineWidth = 1;
    }

    private renderCanvas() {
        return;
        const tileSize = this.props.tileSize;
        const width = this.props.width;
        const height = this.props.height;
        const canvas = this.canvasRef.current;
        canvas.width = this.props.viewportWidth;
        canvas.height = this.props.viewportHeight;
        const context = canvas.getContext('2d');
        context.translate(this.props.viewportWidth / 2, this.props.viewportHeight / 2);
        context.translate(this.state.panX, this.state.panY);
        context.scale(this.state.zoom, this.state.zoom);
        context.translate(-(width * tileSize) / 2, -(height * tileSize) / 2);
        this.renderBackground(context);
        if (this.props.layers) {
            this.props.layers.forEach(display => {
                display(context);
            });
        }
        if (!this.props.hideGrid) this.renderGridlines(context);
        this.renderOutline(context);
    }

    public componentDidMount() {
        this.renderCanvas();
    }

    public componentDidUpdate() {
        this.renderCanvas();
    }

    public render() {
        return <Stage
            width={this.props.viewportWidth}
            height={this.props.viewportHeight}
            options={{
                backgroundColor: '0xff0000',
            }}
        >
        </Stage>
    }
}
