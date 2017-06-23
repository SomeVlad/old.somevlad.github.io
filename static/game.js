//Aliases
const Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    TextureCache = PIXI.utils.TextureCache;

let SPACESHIP, ASTEROID_ARRAY = [],
    state;

const keyObject = keyboard()

keyObject.press = function () {
    console.log("key object pressed");
};
keyObject.release = function () {
    console.log("key object released");
};

//Create a Pixi stage and renderer and add the 
//renderer.view to the DOM
const stage = new Container(),
    renderer = autoDetectRenderer(512, 512, {
        antialias: false,
        transparent: false,
        resolution: 1
    });
document.getElementById('canvas').appendChild(renderer.view);

const asteroid1JsonPath = "/images/404/asteroid-1/asteroid-1.json";
const spaceshipPath = "/images/404/spaceship.png";
//load an image and run the `setup` function when it's done

renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.view.style.top = 0;
renderer.view.style.left = 0;

renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

loader
    .add([
        asteroid1JsonPath,
        spaceshipPath
    ])
    .on("progress", loadProgressHandler)
    .load(setup);

function loadProgressHandler(loader, resource) {
    //Display the file `url` currently being loaded
    console.info("loading: " + resource.url);

    //Display the precentage of files currently loaded
    console.info("progress: " + loader.progress + "%");
}

function setup() {
    console.info('all files loaded!')
    //Create the `cat` sprite, add it to the stage, and render it
    // const asteroids = new Sprite(resources[asteroidsSpritePath].texture);

    SPACESHIP = new Sprite(resources[spaceshipPath].texture);

    SPACESHIP.anchor.set(0.5, 1);
    SPACESHIP.rotation = 0;
    SPACESHIP.scale.set(0.5, 0.5);
    SPACESHIP.position.set(renderer.width / 2, renderer.height - 50);
    SPACESHIP.vx = 0;
    SPACESHIP.vy = 0;

    let velocity = renderer.width/150;

    //Capture the keyboard arrow keys
    var left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    //Left arrow key `press` method
    left.press = function () {

        //Change the cat's velocity when the key is pressed
        SPACESHIP.vx = -velocity;
        SPACESHIP.vy = 0;
    };

    //Left arrow key `release` method
    left.release = function () {

        //If the left arrow has been released, and the right arrow isn't down,
        //and the cat isn't moving vertically:
        //Stop the cat
        if (!right.isDown && SPACESHIP.vy === 0) {
            SPACESHIP.vx = 0;
        }
    };

    //Up
    up.press = function () {
        SPACESHIP.vy = -velocity/2;
        SPACESHIP.vx = 0;
    };
    up.release = function () {
        if (!down.isDown && SPACESHIP.vx === 0) {
            SPACESHIP.vy = 0;
        }
    };

    //Right
    right.press = function () {
        SPACESHIP.vx = velocity;
        SPACESHIP.vy = 0;
    };
    right.release = function () {
        if (!left.isDown && SPACESHIP.vy === 0) {
            SPACESHIP.vx = 0;
        }
    };

    //Down
    down.press = function () {
        SPACESHIP.vy = velocity/2;
        SPACESHIP.vx = 0;
    };
    down.release = function () {
        if (!up.isDown && SPACESHIP.vx === 0) {
            SPACESHIP.vy = 0;
        }
    };

    stage.addChild(SPACESHIP);


    const id = resources[asteroid1JsonPath].textures;
    Array.from(Object.keys(id)).forEach((name) => {
        // add more asteroids 
        ASTEROID_ARRAY.push(new Sprite(id[name]))
    })

    ASTEROID_ARRAY.forEach((asteroid, idx) => {
        asteroid.anchor.set(0.5, 0.5);
        const randomX = randomInt(0, renderer.width);
        asteroid.position.set(randomX, -asteroid.height);
        stage.addChild(asteroid);
    })



    // asteroid.anchor.set(0.5, 0.5);
    // asteroid.rotation = 0.5;
    // asteroid.position.set(30, 30)
    // asteroid.scale.set(0.2, 0.2)

    // stage.addChild(asteroid);


    renderer.render(stage);

    state = play;

    //Start the game loop
    gameLoop();
}

function gameLoop() {

    //Loop this function at 60 frames per second
    requestAnimationFrame(gameLoop);

    state();

    // let rocks fall from the sky!
    //Update the cat's velocity
    // SPACESHIP.vx = 2;
    // SPACESHIP.vy = 0.1;

    //Apply the velocity values to the cat's 
    //position to make it move
    SPACESHIP.x += SPACESHIP.vx;
    SPACESHIP.y += SPACESHIP.vy;

    //Render the stage to see the animation
    renderer.render(stage);
}

function play() {

    //Move the cat 1 pixel to the right each frame
    SPACESHIP.x += SPACESHIP.vx;
    SPACESHIP.y += SPACESHIP.vy;
}

function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}

function randomInt(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}