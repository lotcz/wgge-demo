import SaveGameController from "wgge/game/save/SaveGameController";
import SubController from "./sub/SubController";
import OceanController from "./ocean/OceanController";
import AnimationVector2Controller from "wgge/core/controller/AnimationVector2Controller";
import Vector2 from "wgge/core/model/vector/Vector2";
import Matter from "matter-js";
import DOMHelper from "wgge/core/helper/DOMHelper";

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
			() => this.model.ocean.cornerCoordinates.set(this.model.coordinates.sub(this.game.viewBoxSize.multiply(0.5))),
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

		this.engine = Engine.create();
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
				frictionAir: 0.001,
				friction: 0.001,
				restitution: 0.6,
				mass: 1 //this.model.sub.subWeight.get()
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
		if (this.render) {
			if (this.physicsNeedsMoving) {
				const overlay = document.body.querySelector(".physics-overlay");
				if (overlay) {
					//DOMHelper.createElement()
					overlay.appendChild(this.render.canvas);
					this.physicsNeedsMoving = false;
				}
			}
			const center = new Vector2(this.subBody.position);
			const corner = center.sub(this.game.viewBoxSize.multiply(0.5));//this.model.ocean.cornerCoordinates;
			const end = corner.add(this.game.viewBoxSize);

			Matter.Render.lookAt(this.render, {
				min: {x: corner.x, y: corner.y},
				max: {x: end.x, y: end.y}
			});
			this.render.options.width = this.game.viewBoxSize.x;
			this.render.options.height = this.game.viewBoxSize.y;
		}

		this.model.coordinates.set(this.subBody.position);
		this.engine.gravity.y = 0.4;
	}
}
