import SaveGameController from "wgge/game/save/SaveGameController";
import SubController from "./sub/SubController";
import OceanController from "./ocean/OceanController";
import Matter from "matter-js";

export default class DemoSubmergedController extends SaveGameController {

	/**
	 * @type DemoSubmergedModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(
			new SubController(
				this.game,
				this.model.sub,
				this.model.physicsEngine
			)
		);

		this.addChild(
			new OceanController(
				this.game,
				this.model.ocean
			)
		);

		this.addAutoEvent(
			this.model.sub.absoluteCoordinates,
			'change',
			() => this.model.coordinates.set(this.model.sub.absoluteCoordinates),
			true
		);

		this.addAutoEventMultiple(
			[this.game.viewBoxSize, this.model.coordinates],
			'change',
			() => {
				this.model.ocean.cornerCoordinates.set(this.model.coordinates.sub(this.game.viewBoxSize.multiply(0.5)));
			},
			true
		);

	}

	activateInternal() {
		const bodies = [];

		bodies.push(
			Matter.Bodies.rectangle(
				0,
				this.model.ocean.oceanSize.y + 50,
				this.model.ocean.oceanSize.x,
				100,
				{
					isStatic: true,
					restitution: 0.3,
					friction: 0.01
				}
			)
		);

		for (let i = 0, max = 45; i < max; i++) {
			bodies.push(
				Matter.Bodies.rectangle(
					(Math.random() * this.game.viewBoxSize.x) - (this.game.viewBoxSize.x / 2),
					(Math.random() * this.game.viewBoxSize.y) - (this.game.viewBoxSize.y / 2),
					30,
					30,
					{
						restitution: 0.3,
						friction: 0.01
					}
				)
			);
		}

		const particleOptions = {inertia: Infinity};
		const constraintOptions = {stiffness: 0.05, render: {type: 'line', anchors: false}};

		bodies.push(this.softBody(250, 100, 3, 5, 10, 20, true, 10, particleOptions, constraintOptions));
		bodies.push(this.softBody(450, 100, 8, 5, 1, 2, false, 8, particleOptions, constraintOptions));
		bodies.push(this.softBody(50, 200, 2, 2, 50, 35, true, 18, particleOptions, constraintOptions));

		Matter.Composite.add(this.model.physicsEngine.world, bodies);

		this.runner = Matter.Runner.create();
		Matter.Runner.run(this.runner, this.model.physicsEngine);
	}

	deactivateInternal() {
		Matter.Runner.stop(this.runner);
		this.runner = null;
	}

	/**
	 * Creates a simple soft body like object.
	 * @method softBody
	 * @param {number} xx
	 * @param {number} yy
	 * @param {number} columns
	 * @param {number} rows
	 * @param {number} columnGap
	 * @param {number} rowGap
	 * @param {boolean} crossBrace
	 * @param {number} particleRadius
	 * @param particleOptions
	 * @param constraintOptions
	 * @return A new composite softBody
	 */
	softBody = function (xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
		const Common = Matter.Common,
			Composites = Matter.Composites,
			Bodies = Matter.Bodies;

		particleOptions = Common.extend({inertia: Infinity}, particleOptions);
		constraintOptions = Common.extend({stiffness: 0.05, render: {type: 'line', anchors: false}}, constraintOptions);

		const softBody = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function (x, y) {
			return Bodies.circle(x, y, particleRadius, particleOptions);
		});
		Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);
		softBody.label = 'Soft Body';
		return softBody;
	}

}
