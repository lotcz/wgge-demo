import Matter from "matter-js";
import ControllerBase from "wgge/core/controller/ControllerBase";
import Vector2 from "wgge/core/model/vector/Vector2";
import DOMHelper from "wgge/core/helper/DOMHelper";

export default class DemoPhysicsController extends ControllerBase {

	/**
	 * @type DemoPhysicsModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

	}

	activateInternal() {
		const Engine = Matter.Engine,
			Render = Matter.Render,
			Runner = Matter.Runner,
			Composite = Matter.Composite,
			Bodies = Matter.Bodies;

		this.engine = Engine.create();
		this.engine.gravity.y = 0.4;

		const world = this.engine.world;

		this.render = Render.create({
			element: document.body,
			engine: this.engine,
			options: {
				width: this.game.viewBoxSize.x,
				height: this.game.viewBoxSize.y,
				showVelocity: true,
				hasBounds: true
			}
		});

		Render.run(this.render);

		this.runner = Runner.create();
		Runner.run(this.runner, this.engine);

		this.subBody = Bodies.circle(
			this.game.viewBoxSize.x / 2,
			this.game.viewBoxSize.y / 2,
			20,
			{
				frictionAir: 0.001,
				friction: 0,
				restitution: 0.6,
				mass: 1
			}
		);

		const bodies = [
			this.subBody
		];

		for (let i = 0, max = 15; i < max; i++) {
			const top = i * 250;
			const left = i % 2 === 0 ? -100 : 100;
			const angle = i % 2 === 0 ? Math.PI * 0.15 : -Math.PI * 0.15;
			const body = Bodies.rectangle(
				(this.game.viewBoxSize.x / 2) + left,
				top,
				450,
				20,
				{
					isStatic: true,
					angle: angle,
					restitution: 0.3,
					friction: 0.01
				}
			);
			bodies.push(body);
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
		const center = new Vector2(this.subBody.position);
		const corner = center.add(this.game.viewBoxSize.multiply(-0.5));
		const end = center.add(this.game.viewBoxSize.multiply(0.5));
		Matter.Render.lookAt(this.render, {
			min: {x: corner.x, y: corner.y},
			max: {x: end.x, y: end.y}
		});
	}

}
