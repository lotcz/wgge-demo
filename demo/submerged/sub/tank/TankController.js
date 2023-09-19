import ControllerBase from "wgge/core/controller/ControllerBase";
import AnimationFloatController from "wgge/core/controller/AnimationFloatController";
import Vector2 from "wgge/core/model/vector/Vector2";

export default class TankController extends ControllerBase {

	/**
	 * @type TankModel
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

	updateInternal(delta) {
		if (this.model.physicsBody) {
			const ph = new Vector2(this.model.physicsBody.position);
			this.model.absoluteCoordinates.set(ph);
		}
	}

}
