import * as PIXI from 'pixi.js';
import React from 'react';

interface GridEditorLayer {
    container: PIXI.Container;
}

interface Props {
    viewportWidth: number;
    viewportHeight: number;
    tileSize: number;
    width: number;
    height: number;
    hideGrid?: boolean;
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
    private pixiApp: PIXI.Application;
    private layerContainer = new PIXI.Container();
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
        x -= this.state.panX;
        y -= this.state.panY;
        x /= this.state.zoom;
        y /= this.state.zoom;
        x /= tileSize;
        y /= tileSize;
        x = Math.floor(x);
        y = Math.floor(y);
        return {x, y};
    }

    private createGridlines() {
		const gridlines = new PIXI.Graphics();
		gridlines.lineStyle(2 / this.state.zoom, 0x000000, .1);
		for (let x = 1; x < this.props.width; x++) {
			gridlines.moveTo(x * this.props.tileSize, 0);
			gridlines.lineTo(x * this.props.tileSize, this.props.height * this.props.tileSize);
		}
		for (let y = 1; y < this.props.height; y++) {
			gridlines.moveTo(0, y * this.props.tileSize);
			gridlines.lineTo(this.props.width * this.props.tileSize, y * this.props.tileSize);
		}
		return gridlines;
	}

	private createBorder() {
        const border = new PIXI.Graphics();
        border.lineStyle(2 / this.state.zoom, 0x000000);
        border.lineAlignment = 0;
        border.drawRect(0, 0, this.props.width * this.props.tileSize,
            this.props.height * this.props.tileSize);
        return border;
    }

    public componentDidMount() {
        this.pixiApp = new PIXI.Application({
            width: this.props.viewportWidth,
            height: this.props.viewportHeight,
            transparent: true,
        });
        this.pixiApp.stage.position.x = this.state.panX;
        this.pixiApp.stage.position.y = this.state.panY;
        this.pixiApp.stage.scale.x = this.state.zoom;
        this.pixiApp.stage.scale.y = this.state.zoom;
        if (this.props.layers)
            this.props.layers.forEach(layer => {
                this.layerContainer.addChild(layer.container);
            });
        this.pixiApp.stage.addChild(this.layerContainer);
        this.pixiApp.stage.addChild(this.createGridlines());
        this.pixiApp.stage.addChild(this.createBorder());
        this.containerRef.current.appendChild(this.pixiApp.view);
    }

    public shouldComponentUpdate(newProps: Props) {
        if (newProps.width !== this.props.width || newProps.height !== this.props.height) {
            this.pixiApp.stage.removeChildren(0, this.pixiApp.stage.children.length);
            this.pixiApp.stage.addChild(this.layerContainer);
            this.pixiApp.stage.addChild(this.createGridlines());
            this.pixiApp.stage.addChild(this.createBorder());
        }
        return true;
    }

    public componentDidUpdate() {
        this.pixiApp.renderer.resize(this.props.viewportWidth, this.props.viewportHeight);
        this.pixiApp.stage.position.x = this.state.panX;
        this.pixiApp.stage.position.y = this.state.panY;
        this.pixiApp.stage.scale.x = this.state.zoom;
        this.pixiApp.stage.scale.y = this.state.zoom;
    }

    public render() {
        return <div
            ref={this.containerRef}
            style={{
                width: this.props.viewportWidth,
                height: this.props.viewportHeight,
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
        />;
    }
}
