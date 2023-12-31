import TankModel from "./tank/TankModel";
import {TANK_SHAPE_OXYGEN, TANK_SHAPE_SUB, TANK_SHAPE_WATER} from "./tank/shape/TankShapeModel";
import {FLUID_OXYGEN, FLUID_WATER} from "./tank/shape/FluidModel";
import Vector2 from "wgge/core/model/vector/Vector2";
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
	 * @type FloatValue
	 */
	subVolume;

	/**
	 * @type ModelNodeCollection<TankModel>
	 */
	waterTanks;

	/**
	 * @type ModelNodeCollection<TankModel>
	 */
	oxygenTanks;

	constructor() {
		super(0, 2500, TANK_SHAPE_SUB, FLUID_WATER);

		this.zoom = this.addProperty('zoom', new FloatValue(1));
		this.center = this.addProperty('center', new Vector2(0, 0, false));

		this.subWeight = this.addProperty('subWeight', new FloatValue(10, false));
		this.subVolume = this.addProperty('subVolume', new FloatValue(10, false));

		this.waterTanks = this.addProperty('waterTanks', new ModelNodeCollection(() => new TankModel()));
		this.oxygenTanks = this.addProperty('oxygenTanks', new ModelNodeCollection(() => new TankModel()));

		const updateHandler = () => this.updateSubWeight();
		const updateVolumeHandler = () => this.updateSubVolume();
		this.totalWeight.addEventListener('change', updateHandler);
		this.capacity.max.addEventListener('change', updateVolumeHandler);
		this.waterTanks.addEventListener('add', (t) => t.totalWeight.addEventListener('change', updateHandler));
		this.waterTanks.addEventListener('add', (t) => t.capacity.max.addEventListener('change', updateVolumeHandler));
		this.waterTanks.addEventListener('remove', (t) => t.totalWeight.removeEventListener('change', updateHandler));
		this.waterTanks.addEventListener('remove', (t) => t.capacity.max.addEventListener('change', updateVolumeHandler));
		this.oxygenTanks.addEventListener('add', (t) => t.totalWeight.addEventListener('change', updateHandler));
		this.oxygenTanks.addEventListener('remove', (t) => t.totalWeight.removeEventListener('change', updateHandler));

		this.waterTanks.add(new TankModel(150, 500, TANK_SHAPE_WATER, FLUID_WATER));
		this.waterTanks.add(new TankModel(5, 500, TANK_SHAPE_WATER, FLUID_WATER));
		this.oxygenTanks.add(new TankModel(20, 20, TANK_SHAPE_OXYGEN, FLUID_OXYGEN));
		this.oxygenTanks.add(new TankModel(15, 20, TANK_SHAPE_OXYGEN, FLUID_OXYGEN));
		this.oxygenTanks.add(new TankModel(10, 20, TANK_SHAPE_OXYGEN, FLUID_OXYGEN));

		this.updateSubWeight();
		this.updateSubVolume();
	}

	updateSubWeight() {
		const sub = this.totalWeight.get();
		const water = this.waterTanks.reduce((w, t) => w + t.totalWeight.get(), 0);
		const oxygen = this.oxygenTanks.reduce((w, t) => w + t.totalWeight.get(), 0);
		this.subWeight.set(sub + water + oxygen);
	}

	updateSubVolume() {
		const sub = this.capacity.max.get();
		const water = this.waterTanks.reduce((w, t) => w + t.capacity.max.get(), 0);
		this.subVolume.set(sub + water);
	}
}
