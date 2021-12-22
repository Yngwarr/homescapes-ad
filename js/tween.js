class Tweening {
    constructor(ticker) {
        this.tweens = [];
        ticker.add(delta => this.tick(delta));
    }

    tick(_delta) {
        const now = Date.now();

        for (let i = this.tweens.length - 1; i >= 0; --i) {
            const tween = this.tweens[i];
            tween.tick(now);

            if (tween.complete) {
                this.tweens.splice(i, 1);
            }
        }
    }

    add(...tweens) {
        for (const tween of tweens) {
            if (!(tween instanceof Tween)) {
                throw ValueError('tween must be an instance of Tween');
            }
            this.tweens.push(tween);
            tween.start();
        }
    }
}

class Tween {
    constructor(getter, setter, to, duration, easing, opts = {}) {
        const { onComplete = null, from = false, loop = false } = opts;

        this.getter = getter;
        this.setter = setter;
        this.to = from ? this.getter() : to;
        this.duration = duration;
        this.easing = easing;
        this.onComplete = onComplete;
        this.loop = loop;

        this.from = from ? to : this.getter();
        this.startTime = null;
        this.complete = false;
    }

    static MoveHorizontal(element, ...params) {
        return new Tween(() => element.position.x, x => element.position.x = x, ...params);
    }

    static MoveVertical(element, ...params) {
        return new Tween(() => element.position.y, y => element.position.y = y, ...params);
    }

    static Scale(element, [toX, toY], ...params) {
        return [
            new Tween(() => element.scale.x, x => element.scale.x = x, toX, ...params),
            new Tween(() => element.scale.y, y => element.scale.y = y, toY, ...params)
        ];
    }

    static Opacity(element, ...params) {
        return new Tween(() => element.alpha, a => element.alpha = a, ...params);
    }

    start() {
        this.complete = false;
        this.startTime = Date.now();
    }

    setProperty(getter, setter) {
        this.getter = getter;
        this.setter = setter;
    }

    tick(now) {
        if (now === null || now < this.startTime) return;

        const phase = Math.min(1, (now - this.startTime) / this.duration);
        this.setter(lerp(this.from, this.to, this.easing(phase)));

        if (phase !== 1) return;

        if (this.loop) {
            const from = this.from;
            this.from = this.to;
            this.to = from;
            this.start();
            return;
        }

        this.onComplete?.();
        this.complete = true;
    }
}

class Sequence {
    constructor(stages, tweening, onComplete = null) {
        this._stages = stages;
        this._tweening = tweening;
        this._current = -1;
        this._tweensLive = 0;
        this._onComplete = onComplete;
    }

    start() {
        this._current = -1;
        this._tweensLive = 0;
        this.next();
    }

    next() {
        ++this._current;

        if (this._current >= this._stages.length) {
            this._onComplete?.();
            return;
        }

        const stage = this._stages[this._current];
        this._tweensLive = stage.length;
        for (const tween of stage) {
            if (tween.loop) {
                console.warn('the sequence contains a looping tween, skipping it');
                continue;
            }
            tween.onComplete = () => this.onStageComplete()
            this._tweening.add(tween);
        }
    }

    onStageComplete() {
        --this._tweensLive;
        if (this._tweensLive <= 0) {
            this.next();
        }
    }
}

function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

function backin(amount) {
    return (t) => t * t * ((amount + 1) * t - amount);
}

function backout(amount) {
    return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
}

function easeOutQuad(x) {
    return 1 - (1 - x) * (1 - x);
}

function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}
