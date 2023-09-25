import ObjectModel from "wgge/core/model/ObjectModel";
import Vector2 from "wgge/core/model/vector/Vector2";
import Vector3 from "wgge/core/model/vector/Vector3";
import FloatValue from "wgge/core/model/value/FloatValue";
import Quaternion from "wgge/core/model/vector/Quaternion";

export default class TankShapeModel extends ObjectModel {

	/**
	 * @type Vector2
	 */
	size;

	/**
	 * @type Quaternion
	 */
	color;

	/**
	 * @type Vector3
	 */
	strokeColor;

	/**
	 * @type FloatValue
	 */
	strokeWidth;

	/**
	 * @type FloatValue
	 */
	weight;

	constructor(
		size = new Vector2(1, 1),
		color = new Quaternion(150, 150, 150, 100),
		strokeColor = new Vector3(10, 10, 10),
		strokeWidth = 0.5,
		weight = 0.65
	) {
		super();

		this.size = this.addProperty('size', size);
		this.color = this.addProperty('color', color);
		this.strokeColor = this.addProperty('strokeColor', strokeColor);
		this.strokeWidth = this.addProperty('strokeWidth', new FloatValue(strokeWidth));
		this.weight = this.addProperty('weight', new FloatValue(weight));
	}

}

export const TANK_SHAPE_SUB = new TankShapeModel(
	new Vector2(1, 1),
	new Quaternion(80, 110, 150, 0),
	new Vector3(51, 51, 51),
	3,
	0.65
);

export const TANK_SHAPE_OXYGEN = new TankShapeModel(
	new Vector2(1, 1),
	new Quaternion(150, 150, 150, 255),
	new Vector3(40, 40, 40),
	0.5,
	0.65
);

export const TANK_SHAPE_WATER = new TankShapeModel(
	new Vector2(1, 1),
	new Quaternion(120, 120, 150, 255),
	new Vector3(51, 51, 51),
	3,
	0.65
);
