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

function loadTextures() {
    return {
        logo: PIXI.Texture.from('img/logo.png'),
        back: PIXI.Texture.from('img/background.png'),
        austin: PIXI.Texture.from('img/austin.png'),
        front_plant: PIXI.Texture.from('img/decor/front_plant.png'),
        plant: PIXI.Texture.from('img/decor/plant.png'),
        table: PIXI.Texture.from('img/decor/table.png'),
        sofa: PIXI.Texture.from('img/decor/sofa.png'),
        bookshelf: PIXI.Texture.from('img/decor/bookshelf.png'),
        globe: PIXI.Texture.from('img/decor/globe.png'),
        old_stair: PIXI.Texture.from('img/stair/old.png'),
        new_stairs: [
            PIXI.Texture.from('img/stair/new1.png'),
            PIXI.Texture.from('img/stair/new2.png'),
            PIXI.Texture.from('img/stair/new3.png')
        ],
        hammer: PIXI.Texture.from('img/hammer.png'),
        continue_button: PIXI.Texture.from('img/continue.png'),
    };
}

function init() {
    app = setup();
    tweening = new Tweening(app.ticker);

    const center = [app.screen.width / 2, app.screen.height / 2];
    const textures = loadTextures();

    const decor_info = [{
        texture: textures.plant,
        position: [center[0] - 250, -25]
    }, {
        texture: textures.table,
        anchor: [.5, .5],
        position: [center[0] - 325, center[1] - 50]
    }, {
        texture: textures.sofa,
        anchor: [0, 1],
        position: [150, app.screen.height - 100]
    }, {
        texture: textures.bookshelf,
        position: [center[0] + 160, -40]
    }, {
        texture: textures.plant,
        anchor: [.5, .5],
        position: [app.screen.width - 150, center[1] - 150]
    }, {
        texture: textures.globe,
        anchor: [0, 1],
        position: [100, center[1] - 75]
    }];
    stair = new Stair(
        textures.old_stair,
        textures.new_stairs,
        [0, 1],
        [center[0] + 140, app.screen.height - 90],
        tweening);

    const logo = new PIXI.Sprite(textures.logo);
    logo.position.set(10, -200);

    const background = new PIXI.Sprite(textures.back);
    background.anchor.set(.5);
    background.position.set(...center);

    const austin = new PIXI.Sprite(textures.austin);
    austin.position.set(center[0], 135);

    const frontPlant = new PIXI.Sprite(textures.front_plant);
    frontPlant.anchor.set(0, 1);
    frontPlant.position.set(app.screen.width - 300, app.screen.height + 500);

    const hammer = new PIXI.Sprite(textures.hammer);
    hammer.anchor.set(.5, 1);
    hammer.scale.set(0);
    hammer.position.set(app.screen.width - 230, center[1] + 25);

    const continueButton = new PIXI.Sprite(textures.continue_button);
    continueButton.anchor.set(.5);
    continueButton.scale.set(0);
    continueButton.position.set(center[0], app.screen.height - 100);

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
    app.stage.addChild(frontPlant, hammer, continueButton);

    const decor_stage = decor.map(d => new Tween(() => d.position.y, y => d.position.y = y, -500, 1000, easeOutQuad, {from: true}));
    decor_stage.push(new Tween(() => frontPlant.position.y, y => frontPlant.position.y = y, app.screen.height - 100, 500, easeOutQuad));
    const seq = new Sequence([
        decor_stage,
        [
            new Tween(() => logo.position.y, y => logo.position.y = y, 10, 500, backout(1)),
            new Tween(() => hammer.scale.x, x => hammer.scale.x = x, 1, 500, backout(1)),
            new Tween(() => hammer.scale.y, y => hammer.scale.y = y, 1, 500, backout(1)),
            new Tween(() => continueButton.scale.x, x => continueButton.scale.x = x, 1, 500, backout(1)),
            new Tween(() => continueButton.scale.y, y => continueButton.scale.y = y, 1, 500, backout(1))
        ]
    ], tweening);

    seq.start();
}
