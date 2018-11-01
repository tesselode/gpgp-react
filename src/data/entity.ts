/** The types of parameters that can be defined. */
export enum EntityParameterType {
	Text,
	Number,
	Choice,
	Switch,
}

/** A parameter that can be set for an entity instance. */
export interface EntityParameter {
	/** The name of the parameter. */
	name: string;
	/** The type of the parameter. */
	type: EntityParameterType;
}

/** A text parameter for an entity. */
export interface TextEntityParameter extends EntityParameter {
	/** The default value for the parameter. */
	default?: string;
}

/**
 * Returns if the entity parameter is a text parameter.
 * @param p The parameter to check.
 */
export function isTextEntityParameter(p: EntityParameter): p is TextEntityParameter {
	return p.type === EntityParameterType.Text;
}

/** A number parameter for an entity. */
export interface NumberEntityParameter extends EntityParameter {
	/** Whether the parameter has a minimum value. */
	hasMin?: boolean;
	/** The minimum value of the parameter. */
	min?: number;
	/** Whether the parameter has a maximum value. */
	hasMax?: boolean;
	/** The maximum value of the parameter. */
	max?: number;
	/** Whether to lock the value to an integer. */
	isInteger?: boolean;
	/** The default value for the parameter. */
	default?: number;
	/** Whether to use a slider to edit the parameter. */
	useSlider?: boolean;
}

/**
 * Returns if the entity parameter is a number parameter.
 * @param p The parameter to check.
 */
export function isNumberEntityParameter(p: EntityParameter): p is NumberEntityParameter {
	return p.type === EntityParameterType.Number;
}

/** A choice parameter for an entity. */
export interface ChoiceEntityParameter extends EntityParameter {
	/** The possible choices for the parameter. */
	choices: string[];
	/** The number of the default choice. */
	default?: number;
}

/**
 * Returns if the entity parameter is a choice parameter.
 * @param p The parameter to check.
 */
export function isChoiceEntityParameter(p: EntityParameter): p is ChoiceEntityParameter {
	return p.type === EntityParameterType.Choice;
}

/** A switch parameter for an entity. */
export interface SwitchEntityParameter extends EntityParameter {
	/** Whether the parameter is switched on by default. */
	default?: boolean;
}

/**
 * Returns if the entity parameter is a switch parameter.
 * @param p The parameter to check.
 */
export function isSwitchEntityParameter(p: EntityParameter): p is SwitchEntityParameter {
	return p.type === EntityParameterType.Switch;
}

/** The settings for an entity. */
export default interface Entity {
	/** The name of the entity. */
	name: string;
	/** The width of the entity (in tiles). */
	width: number;
	/** The height of the entity (in tiles). */
	height: number;
	/** The path to the image representing the entity. */
	imagePath?: string;
	/** The color of the rectangle representing the entity
	 * (if no image is specified).
	 */
	color: string;
	/** The parameters that can be set for instances of the entity. */
	parameters: EntityParameter[];
}

/** Creates a new, empty entity. */
export function newEntity(): Entity {
	return {
		name: 'New entity',
		width: 1,
		height: 1,
		color: '#ee0000',
		parameters: [],
	};
}
