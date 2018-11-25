import React from 'react';
import { Button, Col, Jumbotron, Row } from 'reactstrap';

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
	<Jumbotron id='welcome-jumbotron'>
		<div id='welcome-text'>
			<h1>Welcome to GPGP</h1>
			<p>Open an existing project or level, or create a new project.</p>
		</div>
		<div id='welcome-buttons'>
			<Row>
				<Col md={4}>
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
				</Col>
			</Row>
		</div>
	</Jumbotron>;

export default Welcome;
