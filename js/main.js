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

    const logo = new PIXI.Sprite(logo_texture);
    logo.anchor.set(0);
    app.stage.addChild(logo);

    layout.add(logo).pin(0, 0).offset(10, 10);
    layout.updateAll();
}
