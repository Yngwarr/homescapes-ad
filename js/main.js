let app;
let layout;

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

    const logo_texture = PIXI.Texture.from('img/logo.png');
    const background_texture = PIXI.Texture.from('img/background.png');

    const logo = new PIXI.Sprite(logo_texture);
    const background = new PIXI.Sprite(background_texture);

    background.anchor.set(.5);

    app.stage.addChild(background, logo);

    layout.add(background).pin(.5, .5).fit(true);
    layout.add(logo).pin(0, 0).offset(10, 10);
}
