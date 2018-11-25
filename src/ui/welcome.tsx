import React from 'react';
import { Button, Col, Row } from 'reactstrap';

export interface Props {
	/** A function that is called when the "New project" button is pressed. */
	onCreateNewProject: () => void;
	/** A function that is called when the "Open project" button is pressed. */
	onOpenProject: () => void;
	/** A function that is called when the "Open level" button is pressed. */
	onOpenLevel: () => void;
}

/** The introductory screen that is shown when no tabs are open. */
const Welcome = (props: Props) =>
	<div
		style={{
			backgroundImage: 'linear-gradient(-45deg, #eee, #fff)',
		}}
	>
		<div
			style={{
				backgroundImage: 'repeating-linear-gradient(0deg, transparent, ' +
					'transparent ' + (32 - 2) + 'px, ' +
					'#f7f7f7 ' + (32 - 2) + 'px, ' +
					'#f7f7f7 ' + 32 + 'px), ' +
					'repeating-linear-gradient(90deg, transparent, ' +
					'transparent ' + (32 - 2) + 'px, ' +
					'#f7f7f7 ' + (32 - 2) + 'px, ' +
					'#f7f7f7 ' + 32 + 'px)',
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					width: '100%',
					maxWidth: '33em',
					height: '100vh',
					marginLeft: 'auto',
					marginRight: 'auto',
				}}
			>
				<div style={{width: '100%'}}>
					<div
						style={{
							textAlign: 'center',
							animation: 'slide-in .5s .15s',
							animationFillMode: 'both',
						}}
					>
						<h1>Welcome to GPGP</h1>
						<p>Open an existing project or level, or create a new project.</p>
					</div>
					<div
						style={{
							animation: 'slide-in .5s .4s',
							animationFillMode: 'both',
						}}
					>
						<Button
							block
							onClick={() => props.onCreateNewProject()}
						>
							New project
						</Button>
						<br />
						<Row>
							<Col md={6}>
								<Button
									block
									onClick={() => props.onOpenProject()}
								>
									Open project
								</Button>
							</Col>
							<Col md={6}>
								<Button
									block
									onClick={() => props.onOpenLevel()}
								>
									Open level
								</Button>
							</Col>
						</Row>
					</div>
				</div>
			</div>
		</div>
	</div>;

export default Welcome;
