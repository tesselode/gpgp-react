import Project from "./project";
import Layer from "./layer/Layer";

export default interface Level {
	project: Project;
	width: number;
	height: number;
	layers: Array<Layer>;
}
