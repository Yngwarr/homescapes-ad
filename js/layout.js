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
            this._pin(item);

            if (item._fit) {
                const sprite = item.sprite;
                const ratio = sprite.width / sprite.height;
                const screenWidth = this.app.screen.width;
                const screenHeight = this.app.screen.height;
                const screenRatio = screenWidth / screenHeight;

                if (screenRatio > item._ratio) {
                    sprite.height = screenHeight;
                    sprite.width = screenHeight * ratio;
                } else {
                    sprite.width = screenWidth;
                    sprite.height = screenWidth / ratio;
                }
            }
        }
    }

    _pin(item) {
        if (item._pinPoint === null) return;

        const [pinX, pinY] = item._pinPoint;
        const [offX, offY] = item._offset;

        item.sprite.x = this.app.screen.width * pinX + offX;
        item.sprite.y = this.app.screen.height * pinY + offY;
    }
}
