import ObjectModel from "wgge/core/model/ObjectModel";
import TankShapeModel from "./TankShapeModel";
import FluidModel from "./FluidModel";
import Vector2 from "wgge/core/model/vector/Vector2";
import CapacityValue from "wgge/core/model/value/CapacityValue";
import FloatValue from "wgge/core/model/value/FloatValue";

export default class TankModel extends ObjectModel {

	/**
	 * @type Vector2
	 */
	position;

	/**
	 * @type Vector2
	 */
	absolutePosition;

	/**
	 * @type CapacityValue
	 */
	capacity;

	/**
	 * @type TankShapeModel
	 */
	shape;

	/**
	 * @type FluidModel
	 */
	content;

	/**
	 * @type Vector2
	 */
	size;

	/**
	 * @type FloatValue
	 */
	totalWeight;

	constructor(
		fill = 2.5,
		max = 5,
		shape = new TankShapeModel(),
		content = new FluidModel()
	) {
		super();

		this.position = this.addProperty('position', new Vector2());
		this.absolutePosition = this.addProperty('absolutePosition', new Vector2(0, 0, false));
		this.capacity = this.addProperty('capacity', new CapacityValue(0, max, fill));
		this.shape = this.addProperty('shape', shape);
		this.content = this.addProperty('content', content);

		this.size = this.addProperty('size', new Vector2());
		this.totalWeight = this.addProperty('totalWeight', new FloatValue(2, false));

		this.capacity.addEventListener('change', () => this.updateTotalWeight());
		this.capacity.max.addEventListener('change', () => this.updateSize());
		this.shape.weight.addEventListener('change', () => this.updateTotalWeight());
		this.shape.size.addEventListener('change', () => this.updateSize());
		this.content.weight.addEventListener('change', () => this.updateTotalWeight());

		this.updateTotalWeight();
		this.updateSize();
	}

	updateTotalWeight() {
		const shape = this.shape.weight.get() * this.capacity.max.get();
		const content = this.content.weight.get() * this.capacity.get();
		this.totalWeight.set(shape + content);
	}

	updateSize() {
		this.size.set(this.shape.size.multiply(Math.pow(this.capacity.max.get() * 300, 1/3)));
	}

}
