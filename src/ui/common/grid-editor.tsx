import React from 'react';
import { Stage, Graphics, Container } from '@inlet/react-pixi';

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

    private renderBackground() {
        const tileSize = this.props.tileSize;
        const width = this.props.width;
        const height = this.props.height;
        return <Graphics
            draw={g => {
                g.beginFill(this.props.backgroundColor ?
                    parseInt(this.props.backgroundColor.substring(1), 16)
                    : 0xffffff);
                g.drawRect(0, 0, width * tileSize, height * tileSize);
                g.endFill();
            }}
        />;
    }

    private renderOutline() {
        const tileSize = this.props.tileSize;
        const width = this.props.width;
        const height = this.props.height;
        return <Graphics
            draw={g => {
                g.clear();
                g.lineStyle(1, 0x000000);
                g.drawRect(0, 0, width * tileSize, height * tileSize);
            }}
        />;
    }

    private renderGridlines() {
        const tileSize = this.props.tileSize;
        const width = this.props.width;
        const height = this.props.height;
        return <Graphics
            draw={g => {
                g.clear();
                g.lineStyle(1, 0x000000, .25);
                for (let x = 1; x < width; x++) {
                    g.moveTo(x * tileSize, 0);
                    g.lineTo(x * tileSize, height * tileSize);
                }
                for (let y = 1; y < height; y++) {
                    g.moveTo(0, y * tileSize);
                    g.lineTo(width * tileSize, y * tileSize);
                }
            }}
        />;
    }

    public render() {
        return <Stage
            width={this.props.viewportWidth}
            height={this.props.viewportHeight}
            options={{
                transparent: true,
            }}
        >
            <Container
                position={{x: this.state.panX, y: this.state.panY}}
                scale={this.state.zoom}
            >
                {this.renderBackground()}
                {this.renderGridlines()}
                {this.renderOutline()}
            </Container>
        </Stage>;
    }
}
