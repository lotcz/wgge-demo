import GameController from "wgge/game/GameController";
import NullableNodeController from "wgge/core/controller/NullableNodeController";
import MenuItemModel from "wgge/game/menu/item/MenuItemModel";
import MenuModel from "wgge/game/menu/MenuModel";
import {DEMO_FACTORY_CONTAINER} from "./DemoFactory";

export default class DemoGameController extends GameController {

	/**
	 * @type DemoGameModel
	 */
	model;

	constructor(model) {
		super(model, model);

		this.model = model;

		this.addAutoEvent(
			this.model.controls,
			'esc-key',
			() => {
				if (this.model.menu.isSet()) {
					this.hideMenu();
				} else {
					this.showMainMenu();
				}
			}
		);

		this.addAutoEvent(
			this.model.demoType,
			'change',
			() => this.changeDemoType()
		);

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.demoModel,
				(m) => new DEMO_FACTORY_CONTAINER[this.model.demoType.get()].Controller(this.game, m)
			)
		);

	}

	afterActivatedInternal() {
		super.afterActivatedInternal();
		this.showMainMenu();
	}

	changeDemoType() {
		this.model.demoModel.set(null);
		const factory = DEMO_FACTORY_CONTAINER[this.model.demoType.get()];
		if (!factory) {
			console.error("No factory found!", this.model.demoType.get());
			return;
		}

		this.model.demoModel.set(new DEMO_FACTORY_CONTAINER[this.model.demoType.get()].Model());

		this.hideMenu();
	}

	showMainMenu() {
		const menu = new MenuModel('Menu');
		menu.items.add(new MenuItemModel('Physics', () => this.model.demoType.set('physics')));
		menu.items.add(new MenuItemModel('Canvas', () => this.model.demoType.set('canvas')));
		menu.items.add(new MenuItemModel('Submerged', () => this.model.demoType.set('submerged')));
		this.model.menu.set(menu);
	}

}
