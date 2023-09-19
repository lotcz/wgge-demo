
import TankController from "./tank/TankController";
import CollectionController from "wgge/core/controller/CollectionController";
import ControllerBase from "wgge/core/controller/ControllerBase";
import Vector2 from "wgge/core/model/vector/Vector2";

export default class SubController extends ControllerBase {

	/**
	 * @type SubModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(
			new TankController(this.game, this.model)
		);

		this.addChild(
			new CollectionController(
				this.game,
				this.model.oxygenTanks,
				(m) => new TankController(this.game, m)
			)
		);

		this.addChild(
			new CollectionController(
				this.game,
				this.model.waterTanks,
				(m) => new TankController(this.game, m)
			)
		);

		this.addAutoEvent(
			this.game.viewBoxSize,
			'change',
			() => this.model.center.set(this.game.viewBoxSize.multiply(0.5)),
			true
		);
	}

	getTankPosition(angle, distance) {
		const x = Math.sin(angle);
		const y = Math.cos(angle);
		return new Vector2(x, y).multiply(distance);
	}

	arrangeTanks(tanks, distance, start = 0, gap = Math.PI/4) {
		let minX = start;
		let maxX = start;
		let x = start;

		tanks.forEach((t) => {
			t.position.set(this.getTankPosition(x, distance));
			if (x < start) {
				x = maxX + gap;
				maxX = x;
			} else {
				x = minX - gap;
				minX = x;
			}
		});
	}

	rearrange() {
		this.arrangeTanks(this.model.oxygenTanks, this.model.size.x * 0.35, Math.PI, Math.PI/8);
		this.arrangeTanks(this.model.waterTanks, this.model.size.x * 0.7, 0);

	}

	afterActivatedInternal() {
		this.rearrange();
	}
}
