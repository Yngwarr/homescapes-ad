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
        tween.start();
    }
}

class Tween {
    constructor(getter, setter, to, duration, easing, { onComplete = null, from = false }) {
        this.getter = getter;
        this.setter = setter;
        this.to = from ? this.getter() : to;
        this.duration = duration;
        this.easing = easing;
        this.onComplete = onComplete;

        this.from = from ? to : this.getter();
        this.startTime = null;
        this.complete = false;
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

function easeOutQuad(x) {
    return 1 - (1 - x) * (1 - x);
}
