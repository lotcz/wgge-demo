import ObjectModel from "wgge/core/model/ObjectModel";
import Vector2 from "wgge/core/model/vector/Vector2";
import Vector3 from "wgge/core/model/vector/Vector3";
import FloatValue from "wgge/core/model/value/FloatValue";

export default class TankShapeModel extends ObjectModel {

	/**
	 * @type Vector2
	 */
	size;

	/**
	 * @type Vector3
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
		color = new Vector3(150, 150, 150),
		strokeColor = new Vector3(10, 10, 10),
		strokeWidth = 0.5,
		weight = 1
	) {
		super();

		this.size = this.addProperty('size', size);
		this.color = this.addProperty('color', color);
		this.strokeColor = this.addProperty('strokeColor', strokeColor);
		this.strokeWidth = this.addProperty('strokeWidth', new FloatValue(strokeWidth));
		this.weight = this.addProperty('weight', new FloatValue(weight));
	}

}

export const TANK_SHAPE_OXYGEN = new TankShapeModel(
	new Vector2(0.8, 1.2),
	new Vector3(150, 150, 150),
	new Vector3(40, 40, 40),
	0.5,
	0.5
);

export const TANK_SHAPE_WATER = new TankShapeModel(
	new Vector2(1.3, 0.7),
	new Vector3(120, 120, 150),
	new Vector3(20, 20, 40),
	1,
	0.5
);
