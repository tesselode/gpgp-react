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
    private containerRef = React.createRef<HTMLDivElement>();

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
        return <div
            ref={this.containerRef}
            style={{
                width: this.props.viewportWidth + 'px',
                height: this.props.viewportHeight + 'px',
            }}
            onMouseDown={event => {
                switch (event.button) {
                    case 1:
                        this.setState({panning: true});
                }
                if (this.state.button === false) {
                    this.setState({button: event.button});
                    if (this.props.onClick) this.props.onClick(event.button);
                }
            }}
            onMouseUp={event => {
                switch (event.button) {
                    case 1:
                        this.setState({panning: false});
                }
                if (event.button === this.state.button) {
                    this.setState({button: false});
                    if (this.props.onRelease) this.props.onRelease(event.button);
                }
            }}
            onDoubleClick={event => {
                this.props.onDoubleClick(event.button);
            }}
            onMouseMove={event => {
                const rect = this.containerRef.current.getBoundingClientRect();
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
        >
            <Stage
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
            </Stage>
        </div>;
    }
}
