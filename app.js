document.addEventListener('DOMContentLoaded', () => {

    // Game elements
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');

    // Controls
    let startPoint = 150;
    let doodlerLeftSpace = 50;
    let doodlerBottomSpace = startPoint;

    // Other variables
    let isGameOver = false;
    let platformCount = 5;

    // Platforms Arrays
    let platforms = [];

    // TimerId is to stop the setInterval
    let upTimerId;
    let downTimerId;

    // Movement variables
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let rightTimerId;

    // Score
    let score = 0;


    // Creates our Doodler
    const createDoodler = () => {
        grid.appendChild(doodler);
        doodler.classList.add("doodler");
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = doodlerLeftSpace + "px";
        doodler.style.bottom = doodlerBottomSpace + "px";
    };


    // Platform creators
    class Platform {
        constructor(newPlatformBottom) {
            this.bottom = newPlatformBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            // Needs to store visual as a variable because classList wont work otherwise
            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px'

            grid.appendChild(visual);
        };
    };

    const createPlatforms = () => {
        for (let i = 0; i < platformCount; i++) {
            // Determines the platform gap
            let platformGap = 600 / platformCount;
            let newPlatformBottom = 100 + i * platformGap;
            let newPlatform = new Platform(newPlatformBottom);

            platforms.push(newPlatform);
            
        };
    };

    const movePlatforms = () => {
        if (doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + "px";

                // This if statement will get rid of a platform when it hits the bottom of the grid
                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift();

                    // Adds to the score everytime a plaform is removed
                    score++;

                    // And here it will add a new platform at the top everytime one is removed 
                    let newPlatform = new Platform(600);
                    platforms.push(newPlatform);
                }
            });
        };
    };


    // Jumping logic for Doodler functions
    const jump = () => {
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(function () {
            // Makes Doodler go up
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + "px";
            //Makes Doodler go down
            if (doodlerBottomSpace > startPoint + 200) {
                fall();
            };
        }, 30);
    };

    const fall = () => {
        clearInterval(upTimerId);
        isJumping = false;
        downTimerId = setInterval(function() {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + "px";
            if (doodlerBottomSpace <= 0) {
                gameOver();
            }

            // Prevents Doodler from falling through the platforms
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    console.log("landed")
                    startPoint = doodlerBottomSpace;
                    jump();
                };
            });
        }, 30);
    };


    // Finishes the Game
    const gameOver = () => {
        console.log('Game Over');
        isGameOver = true;

        // Will get rid of the Doodler when game over
        while (grid.firstElementChild) {
            grid.removeChild(grid.firstChild);
        };

        // Displays score at game over
        grid.innerHTML = score;

        // Stops jumping
        clearInterval(upTimerId);
        clearInterval(downTimerId);

        // Stops left and right movements along with some glitching
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    };


    // All Key movement functions
    const control = (e) => {
        if (e.key === "ArrowLeft") {
            // move left
            moveLeft()
        } else if (e.key ===  "ArrowRight") {
            // move right
            moveRight();
        } else if (e.key === "ArrowUp") {
            // move straight
            moveStraight();
        };
    };

    const moveLeft = () => {
        if (isGoingRight) {
            clearInterval(rightTimerId);
            isGoingRight = false;
        };
        isGoingLeft = true
        leftTimerId = setInterval(function () {
            // This if function prevents the Doodler for jumping off the screen
            if (doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + "px";
            } else moveRight();
            
        }, 30);
    };

    const moveRight = () => {
        if (isGoingLeft) {
            clearInterval(leftTimerId);
            isGoingLeft = false;
        };
        isGoingRight = true;
        rightTimerId = setInterval(function() {
            if(doodlerLeftSpace <= 340) {
                doodlerLeftSpace += 5;
                doodler.style.left = doodlerLeftSpace + "px";
            } else moveLeft();
        }, 30);
    };

    const moveStraight = () => {
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(leftTimerId);
        clearInterval(rightTimerId)
    };


    // Starts the game
    const start = () => {
        if (!isGameOver) {
            // Creates the Game
            createPlatforms();
            createDoodler();

            // setInterval makes it so the movePlatform function is invoked every 30 miliseconds
            setInterval(movePlatforms, 30)

            // Jump Movements for the Doodler
            jump();

            // Arrow key movements for Doodler
            document.addEventListener('keyup', control)
            
        }
    };
    
    // Attach to Button

    start();

})