import TankController from "./tank/TankController";
import CollectionController from "wgge/core/controller/CollectionController";
import ControllerBase from "wgge/core/controller/ControllerBase";
import Vector2 from "wgge/core/model/vector/Vector2";
import Matter from "matter-js";

export default class SubController extends ControllerBase {

	/**
	 * @type SubModel
	 */
	model;

	/**
	 * @type engine
	 */
	physicsEngine;

	constructor(game, model, engine) {
		super(game, model);

		this.model = model;
		this.physicsEngine = engine;

		this.addAutoEvent(
			this.game.viewBoxSize,
			'change',
			() => this.model.center.set(this.game.viewBoxSize.multiply(0.5)),
			true
		);

		const ACTIONS = {
			'key-down-87': {x: 0, y: -0.005},
			'key-down-83': {x: 0, y: 0.005},
			'key-down-65': {x: -0.005, y: 0},
			'key-down-68': {x: 0.005, y: 0}
		}

		Object.keys(ACTIONS).forEach(
			(key) => this.addAutoEvent(
				this.game.controls,
				key,
				() => {
					Matter.Body.applyForce(
						this.compoundBody,
						this.compoundBody.position,
						ACTIONS[key]
					);
				}
			)
		);
	}

	activateInternal() {
		this.rearrange();

		const parts = [];

		const body = this.model.physicsBody = Matter.Bodies.circle(
			this.model.absoluteCoordinates.x,
			this.model.absoluteCoordinates.y,
			this.model.size.x / 2,
			{
				//collisionFilter: { group: group },
				frictionAir: 0.01,
				friction: 0.01,
				restitution: 0.8,
				mass: this.model.totalWeight.get() / 1000
			}
		);
		parts.push(body);

		const chassis = Matter.Bodies.rectangle(
			this.model.absoluteCoordinates.x,
			this.model.absoluteCoordinates.y + 30,
			110,
			15,
			{
				//collisionFilter: { group: group },
				mass: 0.05
			}
		);
		parts.push(chassis);

		this.model.oxygenTanks.forEach((ot) => {
			parts.push(
				ot.physicsBody = Matter.Bodies.circle(
					this.model.absoluteCoordinates.x + ot.position.x,
					this.model.absoluteCoordinates.y + ot.position.y,
					ot.size.x / 2,
					{
						frictionAir: 0.01,
						friction: 0.01,
						restitution: 0.3,
						mass: 0.01
					}
				)
			);
		});

		this.model.waterTanks.forEach(
			(wt) => {
				parts.push(
					wt.physicsBody = Matter.Bodies.circle(
						this.model.absoluteCoordinates.x + wt.position.x,
						this.model.absoluteCoordinates.y + wt.position.y,
						wt.size.x / 2,
						{mass: 0.05}
					)
				);
			}
		);

		this.compoundBody = Matter.Body.create({parts: parts});
		Matter.Composite.add(this.physicsEngine.world, [this.compoundBody]);

		this.addChild(
			new TankController(this.game, this.model, this.compoundBody)
		);

		this.addChild(
			new CollectionController(
				this.game,
				this.model.oxygenTanks,
				(m) => new TankController(this.game, m, this.compoundBody)
			)
		);

		this.addChild(
			new CollectionController(
				this.game,
				this.model.waterTanks,
				(m) => new TankController(this.game, m, this.compoundBody)
			)
		);
	}

	getTankPosition(angle, distance) {
		const x = Math.sin(angle);
		const y = Math.cos(angle);
		return new Vector2(x, y).multiply(distance);
	}

	arrangeTanks(tanks, distance, start = 0, gap = Math.PI / 3) {
		let minX = start;
		let maxX = start;
		let x = (tanks.count() % 2) === 0 ? start - gap : start;

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
		this.model.position.set(0, 0);
		this.arrangeTanks(this.model.oxygenTanks, this.model.size.x * 0.6, 0, Math.PI / 4);
		this.arrangeTanks(this.model.waterTanks, this.model.size.x * 0.9, 0, Math.PI / 2.3);
	}

	createConstraint(tank, subBody, hanger, index) {
		const point = new Vector2(index * tank.size.x / 2, 0);
		const start = tank.position.add(point).setSize(this.model.size.x / 2);
		return Matter.Constraint.create({
			bodyA: subBody,
			pointA: {x: start.x, y: start.y},
			bodyB: hanger,
			pointB: {x: point.x, y: point.y},
			damping: 0.5,
			stiffness: 0.95
		});
	}


}
