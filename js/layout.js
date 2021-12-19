class LayoutItem {
    constructor(sprite) {
        this.sprite = sprite;
        this._pinPoint = null;
        this._offset = [0, 0];
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
}

class Layout {
    constructor(app) {
        this.app = app;
        this.items = [];

        window.addEventListener('resize', () => this.updateAll());
    }

    add(sprite) {
        const item = new LayoutItem(sprite);
        this.items.push(item);
        return item;
    }

    updateAll() {
        for (const item of this.items) {
            if (item._pinPoint === null)
                continue;

            this._update(item);
        }
    }

    _update(item) {
        const [pinX, pinY] = item._pinPoint;
        const [offX, offY] = item._offset;
        item.sprite.x = this.app.screen.width * pinX + offX;
        item.sprite.y = this.app.screen.height * pinY + offY;
    }
}
