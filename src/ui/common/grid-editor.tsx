import React from 'react';

interface Props {
    viewportWidth: number;
    viewportHeight: number;
}

export default class GridEditor extends React.Component<Props> {
    private canvasRef = React.createRef<HTMLCanvasElement>();

    public componentDidMount() {
        const canvas = this.canvasRef.current;
        canvas.width = this.props.viewportWidth;
        canvas.height = this.props.viewportHeight;
        const context = canvas.getContext('2d');
        context.fillStyle = 'rgba(255, 0, 0, .33)';
        context.fillRect(0, 0, this.props.viewportWidth, this.props.viewportHeight);
    }

    public render() {
        return <canvas ref={this.canvasRef} />;
    }
}
