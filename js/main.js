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
        ok_button: PIXI.Texture.from('img/ok.png'),
        choice_off: PIXI.Texture.from('img/choice/off.png'),
        choice_on: PIXI.Texture.from('img/choice/on.png'),
        choice: [
            PIXI.Texture.from('img/choice/choice1.png'),
            PIXI.Texture.from('img/choice/choice2.png'),
            PIXI.Texture.from('img/choice/choice3.png')
        ],
        end: PIXI.Texture.from('img/end.png')
    };
}

function setupFinScreen(texture, x, y) {
    const shade = new PIXI.Graphics();
    shade.beginFill(0x0);
    shade.drawRect(0, 0, app.screen.width, app.screen.height);
    shade.endFill();
    shade.alpha = .6;

    const endScreen = new PIXI.Sprite(texture);
    endScreen.anchor.set(.5);
    endScreen.position.set(x, y);

    const fin = new PIXI.Container();
    fin.alpha = 0;
    fin.addChild(shade, endScreen);

    return fin;
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

    const stair = new Stair(
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

    const okButton = new PIXI.Sprite(textures.ok_button);
    okButton.anchor.set(.5, 0);
    okButton.interactive = false;
    okButton.alpha = 0;

    const fin = setupFinScreen(textures.end, center[0], center[1] - 75);

    const okMoveTween = Tween.MoveHorizontal(okButton, 0, 250, backout(1));
    const okAlphaTween = Tween.Opacity(okButton, 1, 250, easeOutQuad);
    const choice = new Choice(
        center[0] + 200, 75,
        textures.choice,
        textures.choice_off,
        textures.choice_on,
        i => {
            const [x, y] = choice.buttonPos(i);
            stair.changeState(i);
            if (okButton.interactive === false) {
                okButton.interactive = true;
                okButton.position.set(x, y + 50);
                tweening.add(okAlphaTween);
            } else {
                okMoveTween.from = okButton.position.x;
                okMoveTween.to = x;
                tweening.add(okMoveTween);
            }
        });

    const hammer = new PIXI.Sprite(textures.hammer);
    hammer.anchor.set(.5, 1);
    hammer.scale.set(0);
    hammer.position.set(app.screen.width - 230, center[1] + 25);
    hammer.interactive = true;
    hammer.on('pointerdown', () => {
        hammer.interactive = false;

        const fadeOut = new Sequence([
            Tween.Scale(hammer, [0, 0], 250, backin(1))
        ], tweening);
        fadeOut.start();

        choice.setActive(true, tweening);
    });

    const finAppearTween = Tween.Opacity(fin, 1, 750, easeOutQuad);
    okButton.on('pointerdown', () => {
        okButton.interactive = false;

        const fadeOut = new Sequence([
            Tween.Scale(okButton, [0, 0], 250, backin(1))
        ], tweening);
        fadeOut.start();

        choice.setActive(false, tweening);

        setTimeout(() => tweening.add(finAppearTween), 1500);
    });

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

    app.stage.addChild(background, austin, ...decor);
    stair.addToContainer(app.stage);
    app.stage.addChild(frontPlant);
    choice.addToContainer(app.stage);
    app.stage.addChild(okButton, hammer, fin, logo, continueButton);

    const decor_stage = decor.map(d => Tween.MoveVertical(d, -500, 1000, easeOutQuad, {from: true}));
    decor_stage.push(
        Tween.MoveVertical(frontPlant, app.screen.height - 100, 500, easeOutQuad)
    );
    const seq = new Sequence([
        decor_stage, [
            Tween.MoveVertical(logo, 10, 500, backout(1)),
            ...Tween.Scale(hammer, [1, 1], 500, backout(1)),
            ...Tween.Scale(continueButton, [1, 1], 500, easeOutQuad)
        ]
    ], tweening, () => {
        tweening.add(
            ...Tween.Scale(continueButton, [1.1, 1.1], 1000, easeInOutSine, {loop: true}),
            Tween.MoveVertical(hammer, hammer.position.y - 10, 1000, easeInOutSine, {loop: true})
        );
    });

    seq.start();
}
