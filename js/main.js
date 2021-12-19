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

    const logo = new PIXI.Sprite(logo_texture);
    logo.anchor.set(.5);

    const background = new PIXI.Sprite(background_texture);
    background.anchor.set(.5);

    app.stage.addChild(background, logo);

    layout.add(background).pin(.5, .5).fit(true);
    layout.add(logo).pin(.5, .3);

    logo.scale.x = 0;
    tweening.add(new Tween(
        1,
        () => logo.scale.x,
        x => logo.scale.x = x,
        1000,
        backout(10),
        () => console.log('yay!')
    ));

    //let acc = 0;
    //app.ticker.add(delta => {
        //acc += delta / 2 * Math.PI;
        //logo.scale.x = Math.cos(acc / 100);
    //});
}
