import ObjectModel from "wgge/core/model/ObjectModel";
import Vector2 from "wgge/core/model/vector/Vector2";
import BoolValue from "wgge/core/model/value/BoolValue";
import FloatValue from "wgge/core/model/value/FloatValue";

export default class OceanModel extends ObjectModel {

	/**
	 * @type Vector2
	 */
	cornerCoordinates;

	/**
	 * @type Vector2
	 */
	viewBoxSize;

	/**
	 * @type Vector2
	 */
	oceanSize;

	/**
	 * @type Vector2
	 */
	surfaceStart;

	/**
	 * @type Vector2
	 */
	bottomStart;

	/**
	 * @type BoolValue
	 */
	isSurfaceVisible;

	/**
	 * @type BoolValue
	 */
	isSkyVisible;

	/**
	 * @type BoolValue
	 */
	isOceanVisible;

	/**
	 * @type BoolValue
	 */
	isBottomVisible;

	/**
	 * @type FloatValue
	 */
	oceanSurfacePhase;

	constructor() {
		super();

		this.cornerCoordinates = this.addProperty('cornerCoordinates', new Vector2(0, 0));
		this.viewBoxSize = this.addProperty('viewBoxSize', new Vector2());
		this.oceanSize = this.addProperty('oceanDepth', new Vector2(2000, 500));

		this.surfaceStart = this.addProperty('surfaceStart', new Vector2());
		this.bottomStart = this.addProperty('bottomStart', new Vector2());

		this.isSurfaceVisible = this.addProperty('isSurfaceVisible', new BoolValue(false, false));
		this.isSkyVisible = this.addProperty('isSkyVisible', new BoolValue(false, false));
		this.isOceanVisible = this.addProperty('isOceanVisible', new BoolValue(false, false));
		this.isBottomVisible = this.addProperty('isBottomVisible', new BoolValue(false, false));

		this.oceanSurfacePhase = this.addProperty('oceanSurfacePhase', new FloatValue(0));

		const updateHandler = () => this.updateSurface();
		this.cornerCoordinates.addEventListener('change', updateHandler);
		this.viewBoxSize.addEventListener('change', updateHandler);
		this.oceanSize.addEventListener('change', updateHandler);
		this.updateSurface();
	}

	isVisible(v) {
		return (v.x >= 0 && v.x <= this.viewBoxSize.x) && (v.y >= 0 && v.y <= this.viewBoxSize.y);
	}

	updateSurface() {
		this.surfaceStart.set(new Vector2(0, -this.cornerCoordinates.y + 1));
		this.isSurfaceVisible.set(this.isVisible(this.surfaceStart));

		this.isSkyVisible.set(this.surfaceStart.y > this.cornerCoordinates.y);
		this.isOceanVisible.set(this.surfaceStart.y < this.viewBoxSize.y);

		this.bottomStart.set(new Vector2(0, this.oceanSize.y - this.cornerCoordinates.y));
		this.isBottomVisible.set(this.isVisible(this.bottomStart));
	}
}
