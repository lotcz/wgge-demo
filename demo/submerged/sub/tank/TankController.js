import ControllerBase from "wgge/core/controller/ControllerBase";
import AnimationFloatController from "wgge/core/controller/AnimationFloatController";
import Matter from "matter-js";
import NumberHelper from "wgge/core/helper/NumberHelper";

export default class TankController extends ControllerBase {

	/**
	 * @type TankModel
	 */
	model;

	/**
	 * @type body
	 */
	subBody;

	constructor(game, model, subBody) {
		super(game, model);

		this.model = model;
		this.subBody = subBody;
		this.animationController = null;

		this.addAutoEvent(
			this.model,
			'super-leak',
			(amount) => this.animateCapacity(this.model.capacity.get() + amount)
		);

		this.addAutoEvent(
			this.model,
			'leak',
			(amount) => this.model.leakage.set(amount)
		);

		this.addAutoEventMultiple(
			[this.model.size, this.model.absoluteCoordinates],
			'change',
			() => {
				const subBottom = this.model.absoluteCoordinates.add(this.model.size.multiply(0.5));
				const submerged = subBottom.y / this.model.size.y;
				this.model.submerged.set(NumberHelper.between(0, 1, submerged));
			},
			true
		);
	}

	updateInternal(delta) {
		if (!(this.subBody && this.model.physicsBody)) return;

		this.model.absoluteCoordinates.set(this.model.physicsBody.position);

		const weight = this.model.totalWeight.get();
		const volume = this.model.capacity.max.get();

		this.model.physicsBody.mass = weight / 1000;

		if (this.model.submerged.get() > 0) {
			//console.log(this.subBody.angle);
			const buoyancy = this.model.submerged.get() * ((weight - volume) / 1000);
			const moveY = buoyancy * (delta / 30000);
			Matter.Body.applyForce(
				this.subBody,
				this.model.physicsBody.position,
				{
					x: 0,
					y: moveY
				}
			);
		}

		if (this.model.leakage.get() !== 0) {
			this.model.capacity.increase(this.model.leakage.get() * delta / 1000);
		}
	}

	animateCapacity(target) {
		if (this.animationController) this.removeChild(this.animationController);
		this.addChild(
			new AnimationFloatController(
				this.game,
				this.model.capacity,
				target,
				1000
			)
		);
	}

}
