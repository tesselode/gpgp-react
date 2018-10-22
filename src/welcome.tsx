import React from 'react';
import { Jumbotron, Row, Col, Button } from 'reactstrap';

export interface Props {
	onCreateNewProject: () => void;
	onOpenProject: () => void;
	onOpenLevel: () => void;
}

const Welcome = (props: Props) =>
	<Jumbotron>
		<h1>Welcome to GPGP</h1>
		<p>Open an existing project or level, or create a new project.</p>
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
	</Jumbotron>

export default Welcome;
