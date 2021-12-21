class Choice {
    constructor(x, y, textures, bg, bgChosen, onChange) {
        this._onChange = onChange;
        this._buttons = [];
        for (let i = 0; i < textures.length; ++i) {
            const b = new ChoiceButton(x + i * 135, y, textures[i], bg, bgChosen, () => this.choose(i));
            this._buttons.push(b);
        }
    }

    choose(choice) {
        if (this._buttons[choice].chosen) return;

        for (let i = 0; i < this._buttons.length; ++i) {
            this._buttons[i].chosen = choice === i;
        }
        this._onChange?.(choice);
    }

    setActive(on, tweening) {
        for (const b of this._buttons) {
            b.setActive(on, tweening);
        }
    }

    addToContainer(container) {
        container.addChild(...this._buttons.map(x => x.container));
    }
}

class ChoiceButton {
    constructor(x, y, texture, background, backgroundChosen, onClick) {
        this.container = new PIXI.Container();
        this.container.alpha = 0;
        this.container.on('pointerdown', () => this._onClick());

        this._circle = new PIXI.Sprite(background);
        this._circle.anchor.set(.5);
        this._circle.position.set(x, y);

        this._sprite = new PIXI.Sprite(texture);
        this._sprite.anchor.set(.5);
        this._sprite.position.set(x, y);

        this._onClick = onClick;

        this.container.addChild(this._circle, this._sprite);

        this._background = background;
        this._backgroundChosen = backgroundChosen;

        this._appearTween = new Tween(() => this.container.alpha, a => this.container.alpha = a, 1, 500, easeOutQuad);
        this._chosen = false;
    }

    get chosen() {
        return this._chosen;
    }

    set chosen(on) {
        this._chosen = on;
        this._circle.texture = on ? this._backgroundChosen : this._background;
    }

    setActive(on, tweening) {
        this.container.interactive = on;
        this._appearTween.to = on ? 1 : 0;
        tweening.add(this._appearTween);
    }
}
