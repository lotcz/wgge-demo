import SaveGameController from "wgge/game/save/SaveGameController";
import SubController from "./sub/SubController";
import OceanController from "./ocean/OceanController";
import AnimationVector2Controller from "wgge/core/controller/AnimationVector2Controller";
import Vector2 from "wgge/core/model/vector/Vector2";
import Matter from "matter-js";
import DOMHelper from "wgge/core/helper/DOMHelper";
import NumberHelper from "wgge/core/helper/NumberHelper";
import ProgressValue from "wgge/core/animation/ProgressValue";

export default class DemoSubmergedController extends SaveGameController {

	/**
	 * @type DemoSubmergedModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;
		this.physicsNeedsMoving = false;

		this.addChild(
			new SubController(
				this.game,
				this.model.sub
			)
		);

		this.addChild(
			new OceanController(
				this.game,
				this.model.ocean
			)
		);

		this.addAutoEventMultiple(
			[this.game.viewBoxSize, this.model.coordinates],
			'change',
			() => {
				this.model.ocean.cornerCoordinates.set(this.model.coordinates.sub(this.game.viewBoxSize.multiply(0.5)));
				const subBottom = this.model.coordinates.add(this.model.sub.size.multiply(0.5));
				const submerged = subBottom.y/this.model.sub.size.y;
				this.model.submerged.set(NumberHelper.between(0, 1, submerged));
			},
			true
		);

		this.addAutoEvent(
			this.game.controls,
			'key-down-87',
			() => {
				this.addChild(
					new AnimationVector2Controller(
						this.game,
						this.model.coordinates,
						this.model.coordinates.add(new Vector2(0, -50)),
						500
					)
				);
			}
		);

		this.addAutoEvent(
			this.game.controls,
			'key-down-83',
			() => {
				this.addChild(
					new AnimationVector2Controller(
						this.game,
						this.model.coordinates,
						this.model.coordinates.add(new Vector2(0, 100)),
						500
					)
				);
			}
		);
	}

	activateInternal() {
		const Engine = Matter.Engine,
			Render = Matter.Render,
			Runner = Matter.Runner,
			Composite = Matter.Composite,
			Bodies = Matter.Bodies;

		this.engine = Engine.create({
			enableSleeping: false
		});
		const world = this.engine.world;

		if (this.game.isInDebugMode.get()) {
			this.render = Render.create({
				element: document.body,
				engine: this.engine,
				options: {
					width: this.game.viewBoxSize.x,
					height: this.game.viewBoxSize.y,
					showVelocity: true
				}
			});
			this.physicsNeedsMoving = true;
			Render.run(this.render);
			this.render.canvas.style.backgroundColor = "rgba(0, 0, 0 ,0)";
			this.render.canvas.style.position = "absolute";
		}

		this.runner = Runner.create();
		Runner.run(this.runner, this.engine);

		this.subBody = Bodies.circle(
			this.model.coordinates.x,
			this.model.coordinates.y,
			this.model.sub.size.x/2,
			{
				frictionAir: 0.01,
				friction: 0.01,
				restitution: 0.8,
				mass: this.model.sub.subWeight.get() / 1000
			}
		);

		const bottom = Bodies.rectangle(
			0,
			this.model.ocean.oceanSize.y + 50,
			this.model.ocean.oceanSize.x,
			100,
			{
				isStatic: true,
				restitution: 0.3,
				friction: 0.01
			}
		);

		const bodies = [
			this.subBody,
			bottom
		];

		for (let i = 0, max = 45; i < max; i++) {
			bodies.push(
				Bodies.rectangle(
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

		Composite.add(world, bodies);
	}

	deactivateInternal() {
		if (this.render) {
			Matter.Render.stop(this.render);
			DOMHelper.destroyElement(this.render.canvas);
		}
		if (this.runner) Matter.Runner.stop(this.runner);
		this.engine = null;
		this.render = null;
		this.runner = null;
	}

	updateInternal(delta) {
		this.model.coordinates.set(this.subBody.position);

		const weight = this.model.sub.subWeight.get();
		const volume = this.model.sub.subVolume.get();

		const gravityProgress = new ProgressValue(0.1, 0.6);
		this.engine.gravity.y =	gravityProgress.get(1 - this.model.submerged.get());
		this.subBody.mass = weight / 1000;

		if (this.model.submerged.get() > 0) {
			const buoyancy = this.model.submerged.get() * ((weight - volume) / 1000);
			const moveY = buoyancy * (delta) * weight / 90000000;
			Matter.Body.applyForce(
				this.subBody,
				this.subBody.position,
				{
					x: 0,
					y: moveY
				}
			);
		}

		if (this.render) {
			if (this.physicsNeedsMoving) {
				const overlay = document.body.querySelector(".physics-overlay");
				if (overlay) {
					overlay.appendChild(this.render.canvas);
					this.physicsNeedsMoving = false;
				}
			}
			const corner = this.model.ocean.cornerCoordinates;
			const end = corner.add(this.game.viewBoxSize);

			Matter.Render.lookAt(this.render, {
				min: {x: corner.x, y: corner.y},
				max: {x: end.x, y: end.y}
			});
			this.render.width = this.game.viewBoxSize.x;
			this.render.height = this.game.viewBoxSize.y;
		}

	}
}
