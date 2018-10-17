import React from 'react';
import { Jumbotron, Row, Col, Button } from 'reactstrap';
import Project, { importProject } from './data/Project';
import { remote } from 'electron';
import fs from 'fs';

export interface Props {
	onCreateNewProject: () => void;
	onOpenProject: (project: Project, projectFilePath: string) => void;
}

function openProject(props: Props): void {
	remote.dialog.showOpenDialog({
		filters: [
			{name: 'GPGP projects', extensions: ['gpgpproj']},
		],
	}, paths => {
		if (!paths) return;
		paths.forEach(path => {
			fs.readFile(path, (error, data) => {
				if (error) {
					remote.dialog.showErrorBox('Error opening project', 'The project could not be opened.');
					return;
				}
				let project: Project = JSON.parse(data.toString());
				props.onOpenProject(importProject(project, path), path);
			})
		});
	})
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
							onClick={() => openProject(props)}
						>
							Open project
						</Button>
					</Col>
					<Col md={6}>
						<Button block>Open level</Button>
					</Col>
				</Row>
			</Col>
		</Row>
	</Jumbotron>

export default Welcome;
