import React, { Component } from 'react';

class GridSquare extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hovered: false,
		};
	}

	onHover() {
		this.setState({hovered: true})
		this.props.onHover();
	}

	onUnhover() {
		this.setState({hovered: false})
	}

	render() {
		return(
			<div
				onMouseEnter={() => this.onHover()}
				onMouseLeave={() => this.onUnhover()}
				style={{
					position: 'absolute',
					left: this.props.x + 'em',
					top: this.props.y + 'em',
					width: '1em',
					height: '1em',
					border: '1px solid #bbb',
					background: this.state.hovered ? '#ddd' : 'none',
				}}
			/>
		);
	}
}

export default GridSquare;
