let app;
let layout;
let tweening;

function setup() {
    const app = new PIXI.Application({
        resizeTo: window,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1
    });

    document.body.appendChild(app.view);

    return app;
}

function init() {
    app = setup();
    layout = new Layout(app);
    tweening = new Tweening(app.ticker);

    const logo_texture = PIXI.Texture.from('img/logo.png');
    const background_texture = PIXI.Texture.from('img/background.png');
    const austin_texture = PIXI.Texture.from('img/austin.png');
    const decor_info = [
        PIXI.Texture.from('img/decor/plant_1.png'),
        PIXI.Texture.from('img/decor/plant_2.png'),
        PIXI.Texture.from('img/decor/bookshelf.png'),
        PIXI.Texture.from('img/decor/sofa.png'),
        PIXI.Texture.from('img/decor/globe.png'),
        PIXI.Texture.from('img/decor/table.png')
    ];

    const logo = new PIXI.Sprite(logo_texture);
    logo.position.x = 10;
    logo.position.y = -100;

    const background = new PIXI.Sprite(background_texture);
    background.anchor.set(.5);

    const austin = new PIXI.Sprite(austin_texture);

    for (const t of decor_info) {
    }

    app.stage.addChild(background, austin, logo);

    layout.add(background).pin(.45, .5);
    layout.add(austin).pin(.5, .15);

    tweening.add(new Tween(
        10,
        () => logo.position.y,
        y => logo.position.y = y,
        500,
        backout(1),
        () => console.log('yay!')
    ));
}
