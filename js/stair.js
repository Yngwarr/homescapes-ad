class Stair {
    constructor(oldTexture, newTextures, [anchorX, anchorY], [x, y], tweening) {
        this.old = new PIXI.Sprite(oldTexture);
        this.old.anchor.set(anchorX, anchorY);
        this.old.position.set(x, y);

        this.new = [];
        for (const t of newTextures) {
            const s = new PIXI.Sprite(t);
            s.anchor.set(anchorX, anchorY);
            s.position.set(x, y);
            s.alpha = 0;
            this.new.push(s);
        }

        this._active = this.old;
        this._x = x;
        this._y = y;

        this._tweening = tweening;
        this.opacityTween = new Tween(
            () => this._active.alpha,
            value => this._active.alpha = value,
            1,
            1000,
            easeOutQuad,
            { start: false }
        );
        this.posTween = new Tween(
            () => this._active.position.y,
            value => this._active.position.y = value,
            y - 200,
            1000,
            easeOutQuad,
            { start: false, from: true }
        );
    }

    get statesCount() {
        return this.new.length;
    }

    addToContainer(container) {
        container.addChild(this.old, ...(this.new));
    }

    changeState(stateNum) {
        if (stateNum < 0 || stateNum >= this.statesCount) {
            throw ValueError(`stateNum = ${stateNum} must not exceed statesCount = ${this.statesCount}`);
        }

        this.old.alpha = 0;
        for (const s of this.new) {
            s.position.set(this._x, this._y);
            s.alpha = 0;
        }

        this._active = this.new[stateNum];
        tweening.add(this.opacityTween);
        tweening.add(this.posTween);
    }
}
