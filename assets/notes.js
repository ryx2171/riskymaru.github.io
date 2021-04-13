//#transparent bg

/**_____________________________________________________

const app = new PIXI.Application({ transparent: true });
document.body.appendChild(app.view);
_____________________________________________________**/



//#container
/**_____________________________________________________
const app = new PIXI.Application({
    width: 800, height: 600, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

const container = new PIXI.Container();

app.stage.addChild(container);

// Create a new texture
const texture = PIXI.Texture.from('examples/assets/bunny.png');

// Create a 5x5 grid of bunnies
for (let i = 0; i < 25; i++) {
    const bunny = new PIXI.Sprite(texture);
    bunny.anchor.set(0.5);
    bunny.x = (i % 5) * 40;
    bunny.y = Math.floor(i / 5) * 40;
    container.addChild(bunny);
}

// Move container to the center
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

// Center bunny sprite in local container coordinates
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

// Listen for animate update
app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform
    container.rotation -= 0.01 * delta;
});

_____________________________________________________**/




//#MASK
/**_____________________________________________________
const app = new PIXI.Application();
document.body.appendChild(app.view);

app.stage.interactive = true;

const bg = PIXI.Sprite.from('examples/assets/bg_plane.jpg');

app.stage.addChild(bg);

const cells = PIXI.Sprite.from('examples/assets/cells.png');

cells.scale.set(1.5);

const mask = PIXI.Sprite.from('examples/assets/flowerTop.png');
mask.anchor.set(0.5);
mask.x = 310;
mask.y = 190;

cells.mask = mask;

app.stage.addChild(mask, cells);

const target = new PIXI.Point();

reset();

function reset() {
    target.x = Math.floor(Math.random() * 550);
    target.y = Math.floor(Math.random() * 300);
}

app.ticker.add(() => {
    mask.x += (target.x - mask.x) * 0.1;
    mask.y += (target.y - mask.y) * 0.1;

    if (Math.abs(mask.x - target.x) < 1) {
        reset();
    }
});

//#Graphics Mask 

/**

const app = new PIXI.Application({ antialias: true });
document.body.appendChild(app.view);

app.stage.interactive = true;

const bg = PIXI.Sprite.from('examples/assets/bg_rotate.jpg');

bg.anchor.set(0.5);

bg.x = app.screen.width / 2;
bg.y = app.screen.height / 2;

app.stage.addChild(bg);

const container = new PIXI.Container();
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

// add a bunch of sprites
const bgFront = PIXI.Sprite.from('examples/assets/bg_scene_rotate.jpg');
bgFront.anchor.set(0.5);

const light2 = PIXI.Sprite.from('examples/assets/light_rotate_2.png');
light2.anchor.set(0.5);

const light1 = PIXI.Sprite.from('examples/assets/light_rotate_1.png');
light1.anchor.set(0.5);

const panda = PIXI.Sprite.from('examples/assets/panda.png');
panda.anchor.set(0.5);

container.addChild(bgFront, light2, light1, panda);

app.stage.addChild(container);

// let's create a moving shape
const thing = new PIXI.Graphics();
app.stage.addChild(thing);
thing.x = app.screen.width / 2;
thing.y = app.screen.height / 2;
thing.lineStyle(0);

container.mask = thing;

let count = 0;

app.stage.on('pointertap', () => {
    if (!container.mask) {
        container.mask = thing;
    } else {
        container.mask = null;
    }
});

const help = new PIXI.Text('Click or tap to turn masking on / off.', {
    fontFamily: 'Arial',
    fontSize: 12,
    fontWeight: 'bold',
    fill: 'white',
});
help.y = app.screen.height - 26;
help.x = 10;
app.stage.addChild(help);

app.ticker.add(() => {
    bg.rotation += 0.01;
    bgFront.rotation -= 0.01;

    light1.rotation += 0.02;
    light2.rotation += 0.01;

    panda.scale.x = 1 + Math.sin(count) * 0.04;
    panda.scale.y = 1 + Math.cos(count) * 0.04;

    count += 0.1;

    thing.clear();

    thing.beginFill(0x8bc5ff, 0.4);
    thing.moveTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);
    thing.lineTo(120 + Math.cos(count) * 20, -100 + Math.sin(count) * 20);
    thing.lineTo(120 + Math.sin(count) * 20, 100 + Math.cos(count) * 20);
    thing.lineTo(-120 + Math.cos(count) * 20, 100 + Math.sin(count) * 20);
    thing.rotation = count * 0.1;
});


_____________________________________________________**/




//_____________________________________________________
//#Filter Mask
//_____________________________________________________
const app = new PIXI.Application();
document.body.appendChild(app.view);

// Inner radius of the circle
const radius = 100;

// The blur amount
const blurSize = 32;

app.loader.add('grass', 'examples/assets/bg_grass.jpg');
app.loader.load(setup);

function setup(loader, resources) {
    const background = new PIXI.Sprite(resources.grass.texture);
    app.stage.addChild(background);
    background.width = app.screen.width;
    background.height = app.screen.height;

    const circle = new PIXI.Graphics()
        .beginFill(0xFF0000)
        .drawCircle(radius + blurSize, radius + blurSize, radius)
        .endFill();
    circle.filters = [new PIXI.filters.BlurFilter(blurSize)];

    const bounds = new PIXI.Rectangle(0, 0, (radius + blurSize) * 2, (radius + blurSize) * 2);
    const texture = app.renderer.generateTexture(circle, PIXI.SCALE_MODES.NEAREST, 1, bounds);
    const focus = new PIXI.Sprite(texture);

    app.stage.addChild(focus);
    background.mask = focus;

    app.stage.interactive = true;
    app.stage.on('mousemove', pointerMove);

    function pointerMove(event) {
        focus.position.x = event.data.global.x - focus.width / 2;
        focus.position.y = event.data.global.y - focus.height / 2;
    }
}



//_____________________________________________________
//#Change Texure
//_____________________________________________________
const app = new PIXI.Application();
document.body.appendChild(app.view);

let bol = false;

// create a texture from an image path
const texture = PIXI.Texture.from('examples/assets/flowerTop.png');

// create a second texture
const secondTexture = PIXI.Texture.from('examples/assets/eggHead.png');

// create a new Sprite using the texture
const dude = new PIXI.Sprite(texture);

// center the sprites anchor point
dude.anchor.set(0.5);

// move the sprite to the center of the screen
dude.x = app.screen.width / 2;
dude.y = app.screen.height / 2;

app.stage.addChild(dude);

// make the sprite interactive
dude.interactive = true;
dude.buttonMode = true;

dude.on('pointertap', () => {
    bol = !bol;
    if (bol) {
        dude.texture = secondTexture;
    } else {
        dude.texture = texture;
    }
});



//_____________________________________________________
//#play sprite
//_____________________________________________________
const app = new PIXI.Application();
document.body.appendChild(app.view);

app.stop();

app.loader
    .add('spritesheet', 'examples/assets/spritesheet/mc.json')
    .load(onAssetsLoaded);

function onAssetsLoaded() {
    // create an array to store the textures
    const explosionTextures = [];
    let i;

    for (i = 0; i < 26; i++) {
        const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
        explosionTextures.push(texture);
    }

    for (i = 0; i < 50; i++) {
    // create an explosion AnimatedSprite
        const explosion = new PIXI.AnimatedSprite(explosionTextures);

        explosion.x = Math.random() * app.screen.width;
        explosion.y = Math.random() * app.screen.height;
        explosion.anchor.set(0.5);
        explosion.rotation = Math.random() * Math.PI;
        explosion.scale.set(0.75 + Math.random() * 0.5);
        explosion.gotoAndPlay(Math.random() * 27);
        app.stage.addChild(explosion);
    }

    // start animating
    app.start();
}




//_____________________________________________________
//#text
//_____________________________________________________

const app = new PIXI.Application({ backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

const basicText = new PIXI.Text('Basic text in pixi');
basicText.x = 50;
basicText.y = 100;

app.stage.addChild(basicText);

const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
});

const richText = new PIXI.Text('Rich text with a lot of options and across multiple lines', style);
richText.x = 50;
richText.y = 250;

app.stage.addChild(richText);




//_____________________________________________________
//#bitmap text
//_____________________________________________________

const app = new PIXI.Application({ backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

app.loader
    .add('desyrel', 'examples/assets/bitmap-font/desyrel.xml')
    .load(onAssetsLoaded);

function onAssetsLoaded() {
    const bitmapFontText = new PIXI.BitmapText('bitmap fonts are supported!\nWoo yay!', { font: '55px Desyrel', align: 'left' });

    bitmapFontText.x = 50;
    bitmapFontText.y = 200;

    app.stage.addChild(bitmapFontText);
}




//_____________________________________________________
//#basic graphics
//_____________________________________________________

const app = new PIXI.Application({ antialias: true });
document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();

// Rectangle
graphics.beginFill(0xDE3249);
graphics.drawRect(50, 50, 100, 100);
graphics.endFill();

// Rectangle + line style 1
graphics.lineStyle(2, 0xFEEB77, 1);
graphics.beginFill(0x650A5A);
graphics.drawRect(200, 50, 100, 100);
graphics.endFill();

// Rectangle + line style 2
graphics.lineStyle(10, 0xFFBD01, 1);
graphics.beginFill(0xC34288);
graphics.drawRect(350, 50, 100, 100);
graphics.endFill();

// Rectangle 2
graphics.lineStyle(2, 0xFFFFFF, 1);
graphics.beginFill(0xAA4F08);
graphics.drawRect(530, 50, 140, 100);
graphics.endFill();

// Circle
graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
graphics.beginFill(0xDE3249, 1);
graphics.drawCircle(100, 250, 50);
graphics.endFill();

// Circle + line style 1
graphics.lineStyle(2, 0xFEEB77, 1);
graphics.beginFill(0x650A5A, 1);
graphics.drawCircle(250, 250, 50);
graphics.endFill();

// Circle + line style 2
graphics.lineStyle(10, 0xFFBD01, 1);
graphics.beginFill(0xC34288, 1);
graphics.drawCircle(400, 250, 50);
graphics.endFill();

// Ellipse + line style 2
graphics.lineStyle(2, 0xFFFFFF, 1);
graphics.beginFill(0xAA4F08, 1);
graphics.drawEllipse(600, 250, 80, 50);
graphics.endFill();

// draw a shape
graphics.beginFill(0xFF3300);
graphics.lineStyle(4, 0xffd900, 1);
graphics.moveTo(50, 350);
graphics.lineTo(250, 350);
graphics.lineTo(100, 400);
graphics.lineTo(50, 350);
graphics.closePath();
graphics.endFill();

// draw a rounded rectangle
graphics.lineStyle(2, 0xFF00FF, 1);
graphics.beginFill(0x650A5A, 0.25);
graphics.drawRoundedRect(50, 440, 100, 100, 16);
graphics.endFill();

// draw star
graphics.lineStyle(2, 0xFFFFFF);
graphics.beginFill(0x35CC5A, 1);
graphics.drawStar(360, 370, 5, 50);
graphics.endFill();

// draw star 2
graphics.lineStyle(2, 0xFFFFFF);
graphics.beginFill(0xFFCC5A, 1);
graphics.drawStar(280, 510, 7, 50);
graphics.endFill();

// draw star 3
graphics.lineStyle(4, 0xFFFFFF);
graphics.beginFill(0x55335A, 1);
graphics.drawStar(470, 450, 4, 50);
graphics.endFill();

// draw polygon
const path = [600, 370, 700, 460, 780, 420, 730, 570, 590, 520];

graphics.lineStyle(0);
graphics.beginFill(0x3500FA, 1);
graphics.drawPolygon(path);
graphics.endFill();

app.stage.addChild(graphics);





//_____________________________________________________
//#click
//_____________________________________________________

sprite.on('pointerdown', onClick);

// Alternatively, use the mouse & touch events:
// sprite.on('click', onClick); // mouse-only
// sprite.on('tap', onClick); // touch-only

app.stage.addChild(sprite);

function onClick() {
    sprite.scale.x *= 1.25;
    sprite.scale.y *= 1.25;
}


//_____________________________________________________
//#interactivity
//_____________________________________________________


const app = new PIXI.Application();
document.body.appendChild(app.view);

// create a background...
const background = PIXI.Sprite.from('examples/assets/bg_button.jpg');
background.width = app.screen.width;
background.height = app.screen.height;

// add background to stage...
app.stage.addChild(background);

// create some textures from an image path
const textureButton = PIXI.Texture.from('examples/assets/button.png');
const textureButtonDown = PIXI.Texture.from('examples/assets/button_down.png');
const textureButtonOver = PIXI.Texture.from('examples/assets/button_over.png');

const buttons = [];

const buttonPositions = [
    175, 75,
    655, 75,
    410, 325,
    150, 465,
    685, 445,
];

for (let i = 0; i < 5; i++) {
    const button = new PIXI.Sprite(textureButton);

    button.anchor.set(0.5);
    button.x = buttonPositions[i * 2];
    button.y = buttonPositions[i * 2 + 1];

    // make the button interactive...
    button.interactive = true;
    button.buttonMode = true;

    button
    // Mouse & touch events are normalized into
    // the pointer* events for handling different
    // button events.
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);

    // Use mouse-only events
    // .on('mousedown', onButtonDown)
    // .on('mouseup', onButtonUp)
    // .on('mouseupoutside', onButtonUp)
    // .on('mouseover', onButtonOver)
    // .on('mouseout', onButtonOut)

    // Use touch-only events
    // .on('touchstart', onButtonDown)
    // .on('touchend', onButtonUp)
    // .on('touchendoutside', onButtonUp)

    // add it to the stage
    app.stage.addChild(button);

    // add button to array
    buttons.push(button);
}

// set some silly values...
buttons[0].scale.set(1.2);
buttons[2].rotation = Math.PI / 10;
buttons[3].scale.set(0.8);
buttons[4].scale.set(0.8, 1.2);
buttons[4].rotation = Math.PI;

function onButtonDown() {
    this.isdown = true;
    this.texture = textureButtonDown;
    this.alpha = 1;
}

function onButtonUp() {
    this.isdown = false;
    if (this.isOver) {
        this.texture = textureButtonOver;
    } else {
        this.texture = textureButton;
    }
}

function onButtonOver() {
    this.isOver = true;
    if (this.isdown) {
        return;
    }
    this.texture = textureButtonOver;
}

function onButtonOut() {
    this.isOver = false;
    if (this.isdown) {
        return;
    }
    this.texture = textureButton;
}

//_____________________________________________________
//#drag
//_____________________________________________________


const app = new PIXI.Application({ backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

// create a texture from an image path
const texture = PIXI.Texture.from('examples/assets/bunny.png');

// Scale mode for pixelation
texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

for (let i = 0; i < 10; i++) {
    createBunny(
        Math.floor(Math.random() * app.screen.width),
        Math.floor(Math.random() * app.screen.height),
    );
}

function createBunny(x, y) {
    // create our little bunny friend..
    const bunny = new PIXI.Sprite(texture);

    // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    bunny.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    bunny.buttonMode = true;

    // center the bunny's anchor point
    bunny.anchor.set(0.5);

    // make it a bit bigger, so it's easier to grab
    bunny.scale.set(3);

    // setup events for mouse + touch using
    // the pointer events
    bunny
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    // For mouse-only events
    // .on('mousedown', onDragStart)
    // .on('mouseup', onDragEnd)
    // .on('mouseupoutside', onDragEnd)
    // .on('mousemove', onDragMove);

    // For touch-only events
    // .on('touchstart', onDragStart)
    // .on('touchend', onDragEnd)
    // .on('touchendoutside', onDragEnd)
    // .on('touchmove', onDragMove);

    // move the sprite to its designated position
    bunny.x = x;
    bunny.y = y;

    // add it to the stage
    app.stage.addChild(bunny);
}

function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}


//_____________________________________________________
//#custom hit area
//_____________________________________________________

const app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

const yellowStar = PIXI.Texture.from('examples/assets/yellowstar.png');

// Standard Sprite Button
const starButton1 = new PIXI.Sprite(yellowStar);

starButton1.position.set(50, 200);

starButton1.buttonMode = true;
starButton1.interactive = true;

starButton1.on('pointerdown', (event) => onClick(starButton1));

starButton1.on('pointerover', (event) => onPointerOver(starButton1));

starButton1.on('pointerout', (event) => onPointerOut(starButton1));

// Custom Hitarea Button
const starButton2 = new PIXI.Sprite(yellowStar);
starButton2.position.set(250, 200);

// Create a hitarea that matches the sprite, which will be used for point
// intersection
starButton2.hitArea = new PIXI.Polygon([
    80, 0,
    100, 50,
    160, 55,
    115, 95,
    130, 150,
    80, 120,
    30, 150,
    45, 95,
    0, 55,
    60, 50,
]);
starButton2.buttonMode = true;
starButton2.interactive = true;

starButton2.on('pointerdown', (event) => onClick(starButton2));

starButton2.on('pointerover', (event) => onPointerOver(starButton2));

starButton2.on('pointerout', (event) => onPointerOut(starButton2));

// With Mask, No Hit Area
const starButton3 = new PIXI.Sprite(yellowStar);

starButton3.position.set(450, 200);

starButton3.buttonMode = true;
starButton3.interactive = true;

const squareMask = new PIXI.Graphics()
    .beginFill(0xFFFFFF)
    .drawRect(starButton3.x, starButton3.y, 75, 200)
    .endFill();

starButton3.mask = squareMask;

starButton3.on('pointerdown', (event) => onClick(starButton3));

starButton3.on('pointerover', (event) => onPointerOver(starButton3));

starButton3.on('pointerout', (event) => onPointerOut(starButton3));

// With a Mask and Hit Area
// Hitareas ignore masks. You can still click on a button made in this way,
// even from areas covered by a mask
const starButton4 = new PIXI.Sprite(yellowStar);
starButton4.position.set(600, 200);

const squareMask2 = new PIXI.Graphics()
    .beginFill(0xFFFFFF)
    .drawRect(starButton4.x, starButton4.y, 75, 200)
    .endFill();

starButton4.mask = squareMask2;

// Again, hitarea for intersection checks
starButton4.hitArea = new PIXI.Polygon([
    80, 0,
    100, 50,
    160, 55,
    115, 95,
    130, 150,
    80, 120,
    30, 150,
    45, 95,
    0, 55,
    60, 50,
]);
starButton4.buttonMode = true;
starButton4.interactive = true;

starButton4.on('pointerdown', (event) => onClick(starButton4));

starButton4.on('pointerover', (event) => onPointerOver(starButton4));

starButton4.on('pointerout', (event) => onPointerOut(starButton4));

const style = new PIXI.TextStyle({ fill: '#ffffff' });

const text1 = new PIXI.Text('Standard', style);
text1.x = starButton1.x + 25;
text1.y = starButton1.y + 170;

const text2 = new PIXI.Text('Hit Area', style);
text2.x = starButton2.x + 35;
text2.y = starButton2.y + 170;

const text3 = new PIXI.Text('Mask', style);
text3.x = starButton3.x + 10;
text3.y = starButton3.y + 170;

const text4 = new PIXI.Text('Mask + Hit Area', style);
text4.x = starButton4.x - 10;
text4.y = starButton4.y + 170;

// Add to stage
app.stage.addChild(
    starButton2,
    starButton1,
    starButton3,
    starButton4,
    squareMask,
    squareMask2,
    text1,
    text2,
    text3,
    text4,
);

function onClick(object) {
    object.tint = 0x333333;
}

function onPointerOver(object) {
    object.tint = 0x666666;
}

function onPointerOut(object) {
    object.tint = 0xFFFFFF;
}


//_____________________________________________________
//#filter blur
//_____________________________________________________


const app = new PIXI.Application();
document.body.appendChild(app.view);

const bg = PIXI.Sprite.from('examples/assets/pixi-filters/bg_depth_blur.jpg');
bg.width = app.screen.width;
bg.height = app.screen.height;
app.stage.addChild(bg);

const littleDudes = PIXI.Sprite.from('examples/assets/pixi-filters/depth_blur_dudes.jpg');
littleDudes.x = (app.screen.width / 2) - 315;
littleDudes.y = 200;
app.stage.addChild(littleDudes);

const littleRobot = PIXI.Sprite.from('examples/assets/pixi-filters/depth_blur_moby.jpg');
littleRobot.x = (app.screen.width / 2) - 200;
littleRobot.y = 100;
app.stage.addChild(littleRobot);

const blurFilter1 = new PIXI.filters.BlurFilter();
const blurFilter2 = new PIXI.filters.BlurFilter();

littleDudes.filters = [blurFilter1];
littleRobot.filters = [blurFilter2];

let count = 0;

app.ticker.add(() => {
    count += 0.005;

    const blurAmount = Math.cos(count);
    const blurAmount2 = Math.sin(count);

    blurFilter1.blur = 20 * (blurAmount);
    blurFilter2.blur = 20 * (blurAmount2);
});





//_____________________________________________________
//#flip
//_____________________________________________________


const app = new PIXI.Application({ backgroundColor: 0x103322 });
document.body.appendChild(app.view);

const bigWhiteTexture = new PIXI.Texture(PIXI.Texture.WHITE.baseTexture);
bigWhiteTexture.orig.width = 30;
bigWhiteTexture.orig.height = 30;

const squareFar = new PIXI.Sprite(bigWhiteTexture);
squareFar.tint = 0xff0000;
squareFar.factor = 1;
squareFar.anchor.set(0.5);
squareFar.position.set(app.screen.width / 2, 50);

// create a new Sprite from an image path
const container = new PIXI.projection.Container2d();
container.position.set(app.screen.width / 2, app.screen.height);

const surface = new PIXI.projection.Sprite2d(PIXI.Texture.from('examples/assets/bg_plane.jpg'));
surface.anchor.set(0.5, 1.0);
// surface.scale.y = -1; //sorry, have to do that to make a correct projection
surface.width = app.screen.width;
surface.height = app.screen.height;
// var squarePlane = new PIXI.projection.Sprite2d(PIXI.Texture.from('examples/assets/flowerTop.png'));
const squarePlane = new PIXI.projection.Sprite2d(bigWhiteTexture);
squarePlane.tint = 0xff0000;
squarePlane.factor = 1;
squarePlane.proj.affine = PIXI.projection.AFFINE.AXIS_X;
squarePlane.anchor.set(0.5, 0.0);
squarePlane.position.set(-app.screen.width / 4, -app.screen.height / 2);

const bunny = new PIXI.projection.Sprite2d(PIXI.Texture.from('examples/assets/flowerTop.png'));
bunny.anchor.set(0.5, 1.0);

app.stage.addChild(container);
app.stage.addChild(squareFar);
container.addChild(surface);
container.addChild(squarePlane);
squarePlane.addChild(bunny);

// Listen for animate update
app.ticker.add((delta) => {
    const pos = container.toLocal(squareFar.position, undefined, undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
    // need to invert this thing, otherwise we'll have to use scale.y=-1 which is not good
    pos.y = -pos.y;
    pos.x = -pos.x;
    container.proj.setAxisY(pos, -squareFar.factor);

    squarePlane.proj.affine = squarePlane.factor
        ? PIXI.projection.AFFINE.AXIS_X : PIXI.projection.AFFINE.NONE;
    squarePlane.rotation += 0.1;
});

addInteraction(squareFar);
addInteraction(squarePlane);
// move the bunny too!
addInteraction(bunny);

// === CLICKS AND SNAP ===

// changes axis factor
function toggle(obj) {
    if (obj !== bunny) {
        obj.factor = 1.0 - obj.factor;
        obj.tint = obj.factor ? 0xff0033 : 0x00ff00;
    }
}

function snap(obj) {
    if (obj === bunny) {
        obj.position.set(0);
    } else if (obj === squarePlane) {
    // plane bounds
        obj.position.x = Math.min(Math.max(obj.position.x, -app.screen.width / 2 + 10), app.screen.width / 2 - 10);
        obj.position.y = Math.min(Math.max(obj.position.y, -app.screen.height + 10), 10);
    } else {
    // far
        obj.position.x = Math.min(Math.max(obj.position.x, 0), app.screen.width);
        obj.position.y = Math.min(Math.max(obj.position.y, 0), app.screen.height);
    }
}

// === INTERACTION CODE  ===

function addInteraction(obj) {
    obj.interactive = true;
    obj
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
}

function onDragStart(event) {
    const obj = event.currentTarget;
    obj.dragData = event.data;
    obj.dragging = 1;
    obj.dragPointerStart = event.data.getLocalPosition(obj.parent);
    obj.dragObjStart = new PIXI.Point();
    obj.dragObjStart.copyFrom(obj.position);
    obj.dragGlobalStart = new PIXI.Point();
    obj.dragGlobalStart.copyFrom(event.data.global);
    event.stopPropagation();
}

function onDragEnd(event) {
    const obj = event.currentTarget;
    if (!obj.dragging) return;
    if (obj.dragging === 1) {
        toggle(obj);
    } else {
        snap(obj);
    }

    obj.dragging = 0;
    obj.dragData = null;

    event.stopPropagation();
    // set the interaction data to null
}

function onDragMove(event) {
    const obj = event.currentTarget;
    if (!obj.dragging) return;
    event.stopPropagation();
    const data = obj.dragData; // it can be different pointer!
    if (obj.dragging === 1) {
    // click or drag?
        if (Math.abs(data.global.x - obj.dragGlobalStart.x)
            + Math.abs(data.global.y - obj.dragGlobalStart.y) >= 3) {
            // DRAG
            obj.dragging = 2;
        }
    }
    if (obj.dragging === 2) {
        const dragPointerEnd = data.getLocalPosition(obj.parent);
        // DRAG
        obj.position.set(
            obj.dragObjStart.x + (dragPointerEnd.x - obj.dragPointerStart.x),
            obj.dragObjStart.y + (dragPointerEnd.y - obj.dragPointerStart.y),
        );
    }
}