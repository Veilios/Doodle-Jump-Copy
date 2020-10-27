document.addEventListener('DOMContentLoaded', () => {

    // Game elements
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');

    // Controls
    let doodlerLeftSpace = 50;
    let doodlerBottomSpace = 150;

    // Other variables
    let isGameOver = false;
    let platformCount = 5;

    // Empty Array for platforms
    let platforms = [];

    const createDoodler = () => {
        grid.appendChild(doodler);
        doodler.classList.add("doodler");
        doodler.style.left = doodlerLeftSpace + "px";
        doodler.style.bottom = doodlerBottomSpace + "px";
    };

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
            });
        };
    };

    const start = () => {
        if (!isGameOver) {
            createDoodler();
            createPlatforms();
            // setInterval makes it so the movePlatform function is invoked every 30 miliseconds
            setInterval(movePlatforms, 30)
        }
    };
    
    // Attach to Button

    start();

})