import TankModel from "./tank/TankModel";
import TankShapeModel, {TANK_SHAPE_OXYGEN, TANK_SHAPE_WATER} from "./tank/TankShapeModel";
import {FLUID_OXYGEN, FLUID_WATER} from "./tank/FluidModel";
import Vector2 from "wgge/core/model/vector/Vector2";
import Vector3 from "wgge/core/model/vector/Vector3";
import FloatValue from "wgge/core/model/value/FloatValue";
import ModelNodeCollection from "wgge/core/model/collection/ModelNodeCollection";

export default class SubModel extends TankModel {

	/**
	 * @type Vector2
	 */
	center;

	/**
	 * @type FloatValue
	 */
	zoom;

	/**
	 * @type FloatValue
	 */
	subWeight;

	/**
	 * @type ModelNodeCollection<TankModel>
	 */
	waterTanks;

	/**
	 * @type ModelNodeCollection<TankModel>
	 */
	oxygenTanks;

	constructor() {
		super(
			0,
			150,
			new TankShapeModel(
				new Vector2(1, 1),
				new Vector3(150, 150, 180),
				new Vector3(50, 50, 50),
				2,
				2
			),
			FLUID_WATER
		);

		this.zoom = this.addProperty('zoom', new FloatValue(1));
		this.center = this.addProperty('center', new Vector2(0, 0, false));

		this.waterTanks = this.addProperty('waterTanks', new ModelNodeCollection(() => new TankModel()));
		this.waterTanks.add(new TankModel(25, 50, TANK_SHAPE_WATER, FLUID_WATER));
		this.waterTanks.add(new TankModel(5, 50, TANK_SHAPE_WATER, FLUID_WATER));
		this.waterTanks.add(new TankModel(10, 50, TANK_SHAPE_WATER, FLUID_WATER));
		this.oxygenTanks = this.addProperty('oxygenTanks', new ModelNodeCollection(() => new TankModel()));
		this.oxygenTanks.add(new TankModel(20, 20, TANK_SHAPE_OXYGEN, FLUID_OXYGEN));
		this.oxygenTanks.add(new TankModel(15, 20, TANK_SHAPE_OXYGEN, FLUID_OXYGEN));
		this.oxygenTanks.add(new TankModel(10, 20, TANK_SHAPE_OXYGEN, FLUID_OXYGEN));
		this.oxygenTanks.add(new TankModel(0, 20, TANK_SHAPE_OXYGEN, FLUID_OXYGEN));
		this.oxygenTanks.add(new TankModel(0, 20, TANK_SHAPE_OXYGEN, FLUID_OXYGEN));

		this.subWeight = this.addProperty('subWeight', new FloatValue(10, false));

		const updateHandler = () => this.updateSubWeight();
		this.totalWeight.addEventListener('change', updateHandler);
		this.waterTanks.addEventListener('add', (t) => t.totalWeight.addEventListener('change', updateHandler));
		this.waterTanks.addEventListener('remove', (t) => t.totalWeight.removeEventListener('change', updateHandler));
		this.oxygenTanks.addEventListener('add', (t) => t.totalWeight.addEventListener('change', updateHandler));
		this.oxygenTanks.addEventListener('remove', (t) => t.totalWeight.removeEventListener('change', updateHandler));

		this.updateSubWeight();
	}

	updateSubWeight() {
		const sub = this.totalWeight.get();
		const water = this.waterTanks.reduce((w, t) => w + t.totalWeight.get(), 0);
		const oxygen = this.oxygenTanks.reduce((w, t) => w + t.totalWeight.get(), 0);
		this.subWeight.set(sub + water + oxygen);
	}
}
