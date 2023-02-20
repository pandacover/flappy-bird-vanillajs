const app = document.getElementById("app");
const maxWidth = window.innerWidth;
const maxHeight = window.innerHeight;

let spaceKeyFlag = false;
let obstacles = [];
const obstacleColors = [{pipe: "#2B6623", pipeBorder: "#0B6623"}, {pipe: "#708238", pipeBorder: "#408238"}, {pipe: "#3F704D", pipeBorder: "#1f704d"}, {pipe: "#29AB87", pipeBorder: "#09ab87"}];

class Cloud {
    width;
    height;
    posX;
    posY;

    constructor(width, height, posX, posY) {
        this.width = width;
        this.height = height;
        this.posX = posX;
        this.posY = posY;
    }

    createFluff(width, height, posX, posY, cloud) {
        const fluff = document.createElement("div");
        fluff.classList.add('cloud-fluff');
        fluff.style = `width: ${width}px; height: ${height}px; top: ${posY}%; left: ${posX}%;`;
        cloud.appendChild(fluff);
    }

    createCloud() {
        const cloud = document.createElement('div');
        cloud.classList.add("cloud");
        cloud.style = `width: ${this.width}px; height: ${this.height}px; top: ${this.posY}px; left: ${this.posX}px;`;
        const fluffPos = [
            {x: 0, y: 0}, 
            {x: 50, y: -20},
            {x: 100, y: 0},
            {x: 0, y: 100}, 
            {x: 50, y: 120},
            {x: 100, y: 100},
            {x: -20, y: 50},
            {x: 120, y: 50}
        ]
        fluffPos.forEach(({x, y}) => {
            this.createFluff(50, 50, x, y, cloud);
        });
        app.appendChild(cloud)
    }
}

class Obstacle {
    width;
    height;
    x;
    y;
    type;
    constructor(width, height, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

    createObstacle(type="top") {
        this.type = type;
        const obstacle = document.createElement("div");
        const obstacleWrapper = document.createElement("div");
        const obstacleCurve = document.createElement("div");
        const randomColor = obstacleColors[random(0, obstacleColors.length - 1)];

        obstacleCurve.style = `background: ${randomColor.pipe}; box-shadow: 0 0 3px 2px #0008`;
        obstacleCurve.classList.add('obstacle-curve', type);
        obstacleWrapper.appendChild(obstacleCurve);
        obstacleWrapper.classList.add('obstacle-wrapper');
        obstacle.style = `width: ${this.width}px; height: ${this.height}px; position: absolute; transform: translate(${this.x}px, ${this.y}px); background: ${randomColor.pipeBorder}; z-index: 10; box-shadow: 0 0 3px 2px #0008;`;
        obstacle.appendChild(obstacleWrapper);
        app.appendChild(obstacle);
    }
}


class Bird {
    width;
    height;
    color;
    x;
    y;
    velX;
    velY;
    beakColor;

    constructor(width, height, color, beakColor) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.beakColor = beakColor;
        this.posX = 1;
        this.posY = maxHeight/2;
        this.velX = .3;
        this.velY = 1;

        window.addEventListener('keydown', (e) => {
            if(e.key === ' ' && !spaceKeyFlag) {
                spaceKeyFlag = true;
                this.velX = .7;
                this.velY = -(this.posY/3);
                document.getElementById("bird-eyes").animate([
                    { translate: "0% 0%" },
                    { translate: "0 40%" },
                    { translate: "0% 0%" },
                    { translate: "0% -40%" }
                ], { duration: 400, easing: "ease-in-out" })
                document.getElementById("bird-wing").animate([
                    { transform: "rotate(45deg)" },
                    { transform: "rotate(90deg)", translate: "-20% -20%" },
                    { transform: "rotate(45deg)" },
                ], { duration: 1000, easing: "ease-in-out" })
            }
        })

        window.addEventListener('keyup', (e) => {
            if(e.key === ' ') spaceKeyFlag = false;
        })

    }

    createBird() {
        const bird = document.createElement("div");
        const birdStyle = `width: ${this.width}px; height: ${this.height}px; background: ${this.color}; transform: translate(${this.posX}px, ${this.posY}px);`;

        const birdEyes = document.createElement("div");
        birdEyes.id = "bird-eyes"

        const birdBeak = document.createElement("div");
        birdBeak.id = "bird-beak";
        birdBeak.style = `background: ${this.beakColor}`;

        const birdWing = document.createElement("div");
        birdWing.id = "bird-wing";
        birdWing.style = `background: ${this.color}`;

        bird.id = "bird";
        bird.style = birdStyle;
        bird.appendChild(birdEyes);
        bird.appendChild(birdBeak);
        bird.appendChild(birdWing);
        app.appendChild(bird);
    }

    moveBirdAhead() {
        document.getElementById("bird").style = `width: ${this.width}px; height: ${this.height}px; background: ${this.color}; transform: translate(${this.posX + this.velX}px, ${this.posY + this.velY}px);`;

        this.posX += this.velX;
        this.posY += this.velY;
        this.velX = 1;
        this.velY = 0.2 * Math.sqrt(this.posY);
    }

    checkBounds() {
        return (this.posY >= maxHeight);
    }

    collisionDetect() {
        for(let i = 0; i < obstacles.length; ++i) {
            const obstacle = obstacles[i];
            if(this.posX + this.width > obstacle.x && this.posX <= obstacle.x + obstacle.width) {
                if(obstacle.type === "top" && this.posY + this.height < obstacle.height) return true;
                else if(obstacle.type === "bottom" && this.posY > obstacle.y)  return true;
            }
        }
        return false;
    }

}

const random = (minRange = 0, maxRange = 9) => {
    return Math.floor(Math.random() * maxRange) + minRange;
}

window.addEventListener('load', (e) => {
    let distance = 200;
    for(let i = 0; i < 30; ++i) {
        const height = random(60, maxHeight / 2 - 40);
        const width = random(50, 100);
        const obstacleUp = new Obstacle(width, height, distance, 0);
        const obstacleDown = new Obstacle(width, maxHeight - height - 200, distance, height + 200);
        obstacleUp.createObstacle();
        obstacleDown.createObstacle("bottom");
        obstacles.push(obstacleUp, obstacleDown);
        distance += width + 200;

        const cloud = new Cloud(100, 50, random(distance - 60, distance + 60), random(0, maxHeight / 2));
        cloud.createCloud();
    }
    
    const bird = new Bird(40, 40, "yellow", "red");
    bird.createBird();

    function updateBird() {
        bird.moveBirdAhead();
        window.scroll({
            left: bird.posX - 40,
            behavior: "smooth"
        });
        if(bird.checkBounds() || bird.collisionDetect()) {
            alert("GAME OVER XO");
            return;
        }
        setTimeout(() => requestAnimationFrame(updateBird), 10);
    }
    updateBird()
})
