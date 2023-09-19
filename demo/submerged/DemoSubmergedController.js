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

		const ACTIONS = {
			'key-down-87': { x: 0, y: -0.005 },
			'key-down-83': { x: 0, y: 0.005 },
			'key-down-65': { x: -0.005, y: 0 },
			'key-down-68': { x: 0.005, y: 0 }
		}

		Object.keys(ACTIONS).forEach(
			(key) => this.addAutoEvent(
				this.game.controls,
				key,
				() => {
					Matter.Body.applyForce(
						this.subBody,
						this.subBody.position,
						ACTIONS[key]
					);
				}
			)
		);

	}

	afterActivatedInternal() {
		this.engine = Matter.Engine.create({
			enableSleeping: false
		});
		const world = this.engine.world;
		const bodies = [];

		if (this.game.isInDebugMode.get()) {
			this.render = Matter.Render.create({
				element: document.body,
				engine: this.engine,
				options: {
					width: this.game.viewBoxSize.x,
					height: this.game.viewBoxSize.y,
					showVelocity: true,
					wireframeBackground: 'rgba(0, 0, 0 ,0)'
				}
			});
			this.physicsNeedsMoving = true;
			Matter.Render.run(this.render);
			//this.render.canvas.style.backgroundColor = "rgba(0, 0, 0 ,0)";
			this.render.canvas.style.position = "absolute";
		}

		this.subBody = this.addSubBody(this.model.sub, bodies);
		this.model.sub.physicsBody = this.subBody;

		const bottom = Matter.Bodies.rectangle(
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
		bodies.push(bottom);

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

		const particleOptions = { inertia: Infinity };
		const constraintOptions = { stiffness: 0.05, render: { type: 'line', anchors: false }};

		bodies.push(this.softBody(250, 100, 3, 5, 10, 20, true, 10, particleOptions, constraintOptions));
		bodies.push(this.softBody(450, 100, 8, 5, 1, 2, false, 8, particleOptions, constraintOptions));
		bodies.push(this.softBody(50, 200, 2, 2, 50, 35, true, 18, particleOptions, constraintOptions));

		Matter.Composite.add(world, bodies);

		this.runner = Matter.Runner.create();
		Matter.Runner.run(this.runner, this.engine);
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
			const moveY = buoyancy * (delta / 30000);
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
			this.render.options.width = this.game.viewBoxSize.x;
			this.render.options.height = this.game.viewBoxSize.y;
			this.render.canvas.width = this.game.viewBoxSize.x;
			this.render.canvas.height = this.game.viewBoxSize.y;
		}
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
	softBody = function(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
		const Common = Matter.Common,
			Composites = Matter.Composites,
			Bodies = Matter.Bodies;

		particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
		constraintOptions = Common.extend({ stiffness: 0.05, render: { type: 'line', anchors: false } }, constraintOptions);

		const softBody = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y) {
			return Bodies.circle(x, y, particleRadius, particleOptions);
		});
		Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);
		softBody.label = 'Soft Body';
		return softBody;
	}

	/**
	 *
	 * @param {TankModel} tank
	 * @param {body} subBody
	 * @param {body} hanger
	 * @param index
	 * @return
	 */
	createTankHolder(tank, subBody, hanger, index) {
		const point = new Vector2(index * tank.size.x / 2, 0);
		const start = tank.position.add(point).setSize(this.model.sub.size.x/2);
		return Matter.Constraint.create({
			bodyA: subBody,
			pointA: {x: start.x, y: start.y},
			bodyB: hanger,
			pointB: {x: point.x, y: point.y},
			damping: 0.5,
			stiffness: 0.95
		});
	}

	/**
	 *
	 * @param {TankModel} tank
	 * @param {body} subBody
	 * @param {[]} bodies
	 * @return
	 */
	addTankHanger(tank, subBody, bodies) {
		const hanger = Matter.Bodies.circle(
			this.model.coordinates.x + tank.position.x,
			this.model.coordinates.y + tank.position.y,
			tank.size.x/2,
			{mass: 0.05}
		);
		bodies.push(hanger);
		tank.physicsBody = hanger;

		bodies.push(this.createTankHolder(tank, subBody, hanger, -0.8));
		bodies.push(this.createTankHolder(tank, subBody, hanger,0));
		bodies.push(this.createTankHolder(tank, subBody, hanger,0.8));


		/*
		bodies.push(
			Matter.Constraint.create({
				bodyA: hanger,
				bodyB: subBody,
				pointB: { x: 0, y: 0 },
				stiffness: 1,
				length: 0
			})
		);*/
		return hanger;
	}

	/**
	 *
	 * @param {SubModel} sub
	 * @param {[]} bodies
	 * @return
	 */
	addSubBody(sub, bodies) {
		const body = Matter.Bodies.circle(
			this.model.coordinates.x,
			this.model.coordinates.y,
			sub.size.x/2,
			{
				frictionAir: 0.01,
				friction: 0.01,
				restitution: 0.8,
				mass: sub.subWeight.get() / 1000
			}
		);
		const parts = [body];
		sub.oxygenTanks.forEach((ot) => {
			parts.push(
				ot.physicsBody = Matter.Bodies.circle(
					this.model.coordinates.x + ot.position.x,
					this.model.coordinates.y + ot.position.y,
					ot.size.x/2,
					{
						frictionAir: 0.01,
						friction: 0.01,
						restitution: 0.3,
						mass: 0.01
					}
				)
			);
		});

		const compoundBody = Matter.Body.create({parts: parts});
		bodies.push(compoundBody);

		this.model.sub.waterTanks.forEach((wt) => {
			this.addTankHanger(wt, compoundBody, bodies);
		});

		return compoundBody;
	}

}
