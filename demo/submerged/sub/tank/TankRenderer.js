import SvgRenderer from "wgge/core/renderer/svg/SvgRenderer";
import ProgressVector3 from "wgge/core/animation/3d/ProgressVector3";
import Vector2 from "wgge/core/model/vector/Vector2";

export default class TankRenderer extends SvgRenderer {

	/**
	 * @type TankModel
	 */
	model;

	/**
	 * @type SubModel
	 */
	sub;

	constructor(game, model, draw, sub) {
		super(game, model, draw);

		this.model = model;
		this.sub = sub;

		this.addAutoEvent(
			this.sub.center,
			'change',
			() => this.drawTank()
		);
	}

	activateInternal() {
		this.group = this.draw.group();

		this.drawTank();
	}

	deactivateInternal() {
		this.group.remove();
		this.group = null;
	}

	getPosition() {
		return this.sub.center.add(this.model.position);
	}

	drawTank() {
		if (this.ellipse) this.ellipse.remove();
		if (this.filling) this.filling.remove();
		if (this.exhaust) this.exhaust.remove();
		if (this.clip) this.clip.remove();

		let color;
		if (this.model.content.isLiquid.get()) {
			color = this.model.shape.color.asRgbColor();
		} else {
			const colorProgress = new ProgressVector3(this.model.shape.color, this.model.content.color);
			color = colorProgress.get(this.model.capacity.progress.get()).asRgbColor();
		}

		this.ellipse = this.drawEllipse(
			this.group,
			this.getPosition(),
			this.model.size,
			{width: this.model.shape.strokeWidth.get(), color: this.model.shape.strokeColor.asRgbColor()},
			color
		).click(
			() => this.model.triggerEvent('click')
		);

		this.exhaust = this.drawEllipse(
			this.group,
			this.getPosition().sub(new Vector2(0, this.model.size.y * 0.5)),
			this.model.size.multiply(0.3),
			{width: this.model.shape.strokeWidth.get(), color: this.model.shape.strokeColor.asRgbColor()},
			this.model.shape.color.asRgbColor()
		).click(
			() => this.model.triggerEvent('exhaust-click')
		);

		if (this.model.content.isLiquid.get() && this.model.capacity.get() > 0) {
			const height = this.model.size.y * this.model.capacity.progress.get();
			const top = this.model.size.y - height;

			const pos = this.getPosition();

			this.filling = this.group
				.rect(
					this.model.size.x,
					height
				);
			this.filling.fill(
					this.model.content.color.asRgbColor()
				);
			this.filling.center(
					pos.x,
					pos.y + (top / 2)
				);

			const ellipse = this.drawEllipse(
				this.group,
				pos,
				this.model.size
			);

			this.clip = this.group.clip().add(ellipse);
			this.filling.clipWith(this.clip);
		}
	}

	renderInternal() {
		this.drawTank();
	}
}
