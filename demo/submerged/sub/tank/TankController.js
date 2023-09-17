import ControllerBase from "wgge/core/controller/ControllerBase";
import AnimationFloatController from "wgge/core/controller/AnimationFloatController";

export default class TankController extends ControllerBase {

	/**
	 * @type SubModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;
		this.animationController = null;

		this.addAutoEvent(
			this.model,
			'exhaust-click',
			() => this.exhaust()
		);

		this.addAutoEvent(
			this.model,
			'click',
			() => this.inhale()
		);
	}

	exhaust() {
		this.animateCapacity(this.model.capacity.get() - (this.model.capacity.max.get() * 0.2));
	}

	inhale() {
		this.animateCapacity(this.model.capacity.get() + (this.model.capacity.max.get() * 0.2));
	}

	animateCapacity(target) {
		if (this.animationController) this.removeChild(this.animationController);
		this.addChild(
			new AnimationFloatController(
				this.game,
				this.model.capacity,
				target,
				500
			)
		);
	}

}
