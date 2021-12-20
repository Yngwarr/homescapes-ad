let app;
let tweening;
let stair;

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
    const front_plant_texture = PIXI.Texture.from('img/decor/front_plant.png');
    const plant_texture = PIXI.Texture.from('img/decor/plant.png');
    const decor_info = [{
        texture: plant_texture,
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
        texture: plant_texture,
        anchor: [.5, .5],
        position: [app.screen.width - 150, center[1] - 150]
    }, {
        texture: PIXI.Texture.from('img/decor/globe.png'),
        anchor: [0, 1],
        position: [100, center[1] - 75]
    }];
    stair = new Stair(PIXI.Texture.from('img/stair/old.png'), [
        PIXI.Texture.from('img/stair/new1.png'),
        PIXI.Texture.from('img/stair/new2.png'),
        PIXI.Texture.from('img/stair/new3.png')
    ], [0, 1], [center[0] + 140, app.screen.height - 90], tweening);

    const logo = new PIXI.Sprite(logo_texture);
    logo.position.set(10, 10);

    const background = new PIXI.Sprite(background_texture);
    background.anchor.set(.5);
    background.position.set(...center);

    const austin = new PIXI.Sprite(austin_texture);
    austin.position.set(center[0], 135);

    const frontPlant = new PIXI.Sprite(front_plant_texture);
    frontPlant.anchor.set(0, 1);
    frontPlant.position.set(app.screen.width - 300, app.screen.height - 100);

    const decor = [];
    for (const d of decor_info) {
        const sprite = new PIXI.Sprite(d.texture);
        decor.push(sprite);

        if (d.anchor) {
            sprite.anchor.set(...d.anchor);
        }
        sprite.position.set(...d.position);
    }

    app.stage.addChild(background, austin, logo, ...decor);
    stair.addToContainer(app.stage);
    app.stage.addChild(frontPlant);

    tweening.add(new Tween(
        () => logo.position.y,
        y => logo.position.y = y,
        -200,
        1000,
        backout(1),
        { onComplete: () => console.log('yay!'), from: true }
    ));
}
