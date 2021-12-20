let app;
let tweening;

function setup() {
    const app = new PIXI.Application({
        //resizeTo: window,
        width: 1376,
        height: 774,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1
    });

    document.body.appendChild(app.view);

    return app;
}

function init() {
    app = setup();
    tweening = new Tweening(app.ticker);

    const center = [app.screen.width / 2, app.screen.height / 2];

    const logo_texture = PIXI.Texture.from('img/logo.png');
    const background_texture = PIXI.Texture.from('img/background.png');
    const austin_texture = PIXI.Texture.from('img/austin.png');
    const decor_info = [{
        texture: PIXI.Texture.from('img/decor/plant_1.png'),
        position: [center[0] - 250, -25]
    }, {
        texture: PIXI.Texture.from('img/decor/table.png'),
        anchor: [.5, .5],
        position: [center[0] - 325, center[1] - 50]
    }, {
        texture: PIXI.Texture.from('img/decor/sofa.png'),
        anchor: [0, 1],
        position: [150, app.screen.height - 100]
    }, {
        texture: PIXI.Texture.from('img/decor/bookshelf.png'),
        position: [center[0] + 160, -40]
    }, {
        texture: PIXI.Texture.from('img/decor/plant_2.png'),
        anchor: [.5, .5],
        position: [app.screen.width - 150, center[1] - 150]
    }, {
        texture: PIXI.Texture.from('img/decor/globe.png'),
        anchor: [0, 1],
        position: [100, center[1] - 75]
    }];

    const logo = new PIXI.Sprite(logo_texture);
    logo.position.set(10, -200);

    const background = new PIXI.Sprite(background_texture);
    background.anchor.set(.5);
    background.position.set(...center);

    const austin = new PIXI.Sprite(austin_texture);
    austin.position.set(center[0], 135);

    const decor = [];
    for (const d of decor_info) {
        const sprite = new PIXI.Sprite(d.texture);
        decor.push(sprite);

        if (d.anchor) {
            sprite.anchor.set(...d.anchor);
        }
        sprite.position.set(...d.position);
    }

    app.stage.addChild(background, austin, logo);
    app.stage.addChild(...decor);

    tweening.add(new Tween(
        10,
        () => logo.position.y,
        y => logo.position.y = y,
        500,
        backout(1),
        () => console.log('yay!')
    ));
}
