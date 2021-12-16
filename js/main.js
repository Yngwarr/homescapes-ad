function init() {
    const app = new PIXI.Application({
        width: 800,
        height: 600,
        resolution: window.devicePixelRatio || 1
    });

    document.body.appendChild(app.view);

    const logo_texture = PIXI.Texture.from('img/logo.png');

    const logo = new PIXI.Sprite(logo_texture);
    logo.anchor.set(.5);
    app.stage.addChild(logo);

    logo.x = app.screen.width / 2;
    logo.y = app.screen.height / 2;
}
