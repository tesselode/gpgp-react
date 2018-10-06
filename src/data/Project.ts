export default class Project {
	readonly tileSize: number;

	constructor(tileSize: number) {
		this.tileSize = tileSize;
	}

	clone(): Project {
		return new Project(this.tileSize);
	}
}
