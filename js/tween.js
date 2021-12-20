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

    add(tween) {
        if (!(tween instanceof Tween)) {
            throw ValueError('tween must be an instance of Tween');
        }
        this.tweens.push(tween);
    }
}

class Tween {
    constructor(to, getter, setter, duration, easing, onComplete = null) {
        this.to = to;
        this.getter = getter;
        this.setter = setter;
        this.duration = duration;
        this.easing = easing;
        this.onComplete = onComplete;

        this.from = this.getter();
        this.start = Date.now();
        this.complete = false;
    }

    tick(now) {
        if (now < this.start) return;

        const phase = Math.min(1, (now - this.start) / this.duration);
        this.setter(lerp(this.from, this.to, this.easing(phase)));

        if (phase === 1) {
            this.onComplete?.();
            this.complete = true;
            return;
        }
    }
}

function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

function backout(amount) {
    return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
}
