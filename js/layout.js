class LayoutItem {
    constructor(sprite) {
        this.sprite = sprite;
        this._pinPoint = null;
        this._offset = [0, 0];
        this._fit = false;
    }

    pin(x, y) {
        this._pinPoint = [x, y];
        return this;
    }

    unpin() {
        this._pinPoint = null;
        return this;
    }

    offset(x, y) {
        this._offset = [x, y];
        return this;
    }

    fit(value) {
        this._fit = value;
        return this;
    }

    ratio() {
        return this.sprite.texture.orig.width / this.sprite.texture.orig.height;
    }
}

class Layout {
    constructor(app) {
        this.app = app;
        this.items = [];
        this.dirty = true;

        window.addEventListener('resize', () => this.dirty = true);
        app.ticker.add(_delta => this.updateAll());
    }

    add(sprite) {
        const item = new LayoutItem(sprite);
        this.items.push(item);
        return item;
    }

    updateAll() {
        if (!this.dirty) return;

        this.dirty = false;

        for (const item of this.items) {
            this._pin(item);
            this._fit(item);
        }
    }

    _pin(item) {
        if (item._pinPoint === null) return;

        const [pinX, pinY] = item._pinPoint;
        const [offX, offY] = item._offset;

        item.sprite.x = this.app.screen.width * pinX + offX;
        item.sprite.y = this.app.screen.height * pinY + offY;
    }

    _fit(item) {
        if (!item._fit) return;
        if (!item.sprite.texture.valid) {
            this.dirty = true;
            return;
        }

        const sprite = item.sprite;
        const ratio = item.ratio();
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height;
        const screenRatio = screenWidth / screenHeight;

        if (screenRatio < ratio) {
            sprite.height = screenHeight;
            sprite.width = screenHeight * ratio;
        } else {
            sprite.width = screenWidth;
            sprite.height = screenWidth / ratio;
        }
    }
}
