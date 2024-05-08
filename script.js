let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

const drawPacman = (x, y, a, d, c) => {
    // An arc with an opening at the right for the mouth
    let angleRotation = 0;

    ctx.beginPath();
    switch(d){
        case 'r':
            angleRotation = 0;
            break;
        case 'l':
            angleRotation = Math.PI;
            break;
        case 'u':
            angleRotation = - Math.PI / 2;
            break;
        case 'd':
            angleRotation = Math.PI / 2;
            break;
        default:
            angleRotation = 0;
    }
    ctx.arc(x, y, entities.pacman.r, 0.2 * Math.PI - a + angleRotation, 1.8 * Math.PI + a + angleRotation, false);

    // The mouth
    // A line from the end of the arc to the centre
    ctx.lineTo(x, y);

    // A line from the centre of the arc to the start
    ctx.closePath();

    // Fill the pacman shape with yellow
    ctx.fillStyle = c;
    ctx.fill();

    // Draw the black outline (optional)
    ctx.stroke();

    // Draw the eye
    ctx.beginPath();
    let eyeX, eyeY;
    switch(d){
        case 'r':
            eyeX = x;
            eyeY = y-15;
            break;
        case 'l':
            eyeX = x;
            eyeY = y-15;
            break;
        case 'u':
            eyeX = x-15;
            eyeY = y;
            break;
        case 'd':
            eyeX = x+15;
            eyeY = y;
            break;
        default:
            eyeX = x;
            eyeY = y-15;
    }
    ctx.arc(eyeX, eyeY, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fill();
}

const drawGhost = (x, y, d, c) => {
    // An arc with an opening at the right for the mouth

    ctx.beginPath();
    let r = 25;
    ctx.arc(x, y-15, r, Math.PI, 0, false);

    // Draw spikes
    let spike = true;
    for(let i=r-1; i>=-r+1; i-=8){
        if(spike){
            ctx.lineTo(x+i, y+20);
        }else{
            ctx.lineTo(x+i, y+10);
        }
        spike = !spike;
    }

    // A line from the centre of the arc to the start
    ctx.closePath();

    // Fill the pacman shape with yellow
    ctx.fillStyle = c;
    ctx.fill();

    // Draw the black outline (optional)
    ctx.stroke();

    // Draw the corners of eyes
    ctx.beginPath();
    ctx.arc(x-10, y-20, 8, 0, 2*Math.PI, false);
    ctx.arc(x+10, y-20, 8, 0, 2*Math.PI, false);

    // Draw the pupils
    let eyeX, eyeY;
    switch(d){
        case 'r':
            eyeX = x+12.5;
            eyeY = y-20;
            break;
        case 'l':
            eyeX = x+7.5;
            eyeY = y-20;
            break;
        case 'u':
            eyeX = x+10;
            eyeY = y-22.5;
            break;
        case 'd':
            eyeX = x+10;
            eyeY = y-17.5;
            break;
        default:
            eyeX = x+10;
            eyeY = y-20;
    }
    ctx.closePath();
    ctx.fillStyle = "rgb(240, 240, 240)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 4, 0, 2 * Math.PI, false);
    ctx.arc(eyeX-20, eyeY, 4, 0, 2 * Math.PI, false);
    ctx.fillStyle = "black";
    ctx.closePath();
    ctx.fill();
}

const drawWall = (x, y, w, h, d, c) => {
    ctx.fillStyle = c;
    let r;
    if(d=="o"){
        r = h/2;
        ctx.beginPath();
        ctx.rect(x+r, y, w-r*2, h);
        ctx.closePath();
        ctx.fill();
    }else if(d=="v"){
        r = w/2;
        ctx.beginPath();
        ctx.rect(x, y+r, w, h-r*2);
        ctx.closePath();
        ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x+r, y+r, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x+w-r, y+h-r, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowRight':
            sequence += "r";
            entities.pacman.direction = 'r';
            break;
        case 'ArrowLeft':
            sequence += "l";
            entities.pacman.direction = 'l';
            break;
        case 'ArrowUp':
            sequence += "u";
            entities.pacman.direction = 'u';
            break;
        case 'ArrowDown':
            sequence += "d";
            entities.pacman.direction = 'd';
            break;
        case 'a':
            sequence += 'a';
            break;
        case 'b':
            sequence += 'b';
            break;
        case 'Enter':
            sequence += 's';
            break;
    }
});

function randInt(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

async function specialPacMan(){
    if((new Date()).getTime() - startKonami.getTime() < konamiSeconds*1000){
        entities.pacman.color = `rgb(${randInt(1, 255)}, ${randInt(1, 255)}, ${randInt(1, 255)})`;
        setTimeout(specialPacMan, 100);
    }else{
        entities.pacman.color = entities.pacman.defaultColor;
    }
}

async function konami(){
    let konamiCode = "uuddlrlrbas";
    if(sequence==konamiCode){
        startKonami = new Date();
        specialPacMan();
        sequence = "";
    }else if(!konamiCode.startsWith(sequence)){
        sequence = "";
    }
    setTimeout(konami, 1);
}

function checkMove(x, y) {
    for (let wall of entities.walls) {
        // Calcola la distanza tra il centro del cerchio e il punto più vicino nel rettangolo
        var distX = Math.abs(x - wall.x - wall.w / 2);
        var distY = Math.abs(y - wall.y - wall.h / 2);

        // Se la distanza è minore o uguale alla metà della larghezza o altezza del rettangolo + il raggio del cerchio, allora c'è collisione
        if (!(distX > (wall.w / 2 + entities.pacman.r) || distY > (wall.h / 2 + entities.pacman.r))) return false;

        // Controlla anche la collisione negli angoli del rettangolo
        var dx = distX - wall.w / 2;
        var dy = distY - wall.h / 2;
        if (dx * dx + dy * dy <= entities.pacman.r * entities.pacman.r) return false;
    }
    return true;
}

async function initialize(){
    ctx.beginPath();
    let img = new Image();
    img.src = "./imgs/"+settings.difficulty+".png";
    img.addEventListener('load', () => {
        ctx.drawImage(img, 5, 130, 70, 70);
    });

    let img1 = new Image();
    img1.src = "./imgs/pacman.png";
    img1.addEventListener('load', () => {
        let coords = [];
        let startHeight = 250;
        switch(settings.lifes){
            case 3:
                coords.push([5, startHeight]);
                ctx.drawImage(img1, 5, coords[0][1], 70, 70);
                for(let i=1; i<=3; i++){
                    coords.push([15, coords[0][1]+60*i]);
                }
                break;
            case 2:
                coords.push([5, startHeight+60]);
                ctx.drawImage(img1, 5, coords[0][1], 70, 70);
                for(let i=1; i<=2; i++){
                    coords.push([15, coords[0][1]+60*i]);
                }
                break;
            case 1:
                coords.push([5, startHeight+60+60]);
                ctx.drawImage(img1, 5, coords[0][1], 70, 70);
                for(let i=1; i<=1; i++){
                    coords.push([15, coords[0][1]+60*i]);
                }
                break;
            case 0:
                coords.push([5, startHeight+60+60+60]);
                ctx.drawImage(img1, 5, coords[0][1], 70, 70);
                break;
        }
        for(let i=1; i<=settings.lifes; i++){
            let img2 = new Image();
            img2.src = "./imgs/heart.png";
            img2.addEventListener('load', () => {
                ctx.drawImage(img2, coords[i][0], coords[i][1], 50, 50);
            })
        }
    });
    ctx.closePath();
}

async function updateScore(){
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "20px Rebaston";
    ctx.fillText("SCORE", 17, 40);
    ctx.font = "17px Rebaston";
    let xScore;
    switch(String(settings.score).length){
        case 1:
            xScore = 37;
            break;
        case 2:
            xScore = 34;
            break;
        case 3:
            xScore = 31;
            break;
        case 4:
            xScore = 28;
            break;
        case 5:
            xScore = 25;
            break;
        case 6:
            xScore = 22;
            break;
        case 7:
            xScore = 19;
            break;
        case 8:
            xScore = 16;
            break;
        default:
            xScore = 20;
    }
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.fillText(settings.score, xScore, 60);
    ctx.closePath();
    settings.score++;
}

let sequence = "";
let startKonami = 0;
let konamiSeconds = 10;

let entities = {
    pacman: {
        x: canvas.width/2,
        y: canvas.height/2+50+60,
        defaultColor: "yellow",
        color: "yellow",
        direction: "default",
        amplitude: 0,
        step: 0,
        speed: 5,
        r: 30
    },
    ghosts: [
        {
            x: canvas.width/2,
            y: 410,
            color: "#fd0000",
            direction: "default",
        },
        {
            x: canvas.width/2-60,
            y: 510,
            color: "#ff9acc",
            direction: "default",
        },
        {
            x: canvas.width/2,
            y: 520,
            color: "#33ffff",
            direction: "default",
        },
        {
            x: canvas.width/2+60,
            y: 510,
            color: "#fecc32",
            direction: "default",
        }
    ],
    walls: [
        {
            x: 0,
            y: 0,
            w: canvas.width,
            h: 15,
            d: 'o',
            color: "#1515df"
        },
        {
            x: 0+80,
            y: 0,
            w: 15,
            h: canvas.height,
            d: 'v',
            color: "#1515df"
        },
        {
            x: 0,
            y: canvas.height-15,
            w: canvas.width,
            h: 15,
            d: 'o',
            color: "#1515df"
        },
        {
            x: canvas.width-15,
            y: 0,
            w: 15,
            h: canvas.height,
            d: 'v',
            color: "#1515df"
        },
        {
            x: canvas.width/2-(70*3/2),
            y: canvas.height/2+50,
            w: 70*3,
            h: 15,
            d: 'o',
            color: "#1515df"
        },
        {
            x: canvas.width/2+(70*3/2-70),
            y: canvas.height/2-50,
            w: 70,
            h: 15,
            d: 'o',
            color: "#1515df"
        },
        {
            x: canvas.width/2-(70*3/2),
            y: canvas.height/2-50,
            w: 70,
            h: 15,
            d: 'o',
            color: "#1515df"
        },
        {
            x: canvas.width/2-(70*3/2),
            y: canvas.height/2-50,
            w: 15,
            h: 115,
            d: 'v',
            color: "#1515df"
        },
        {
            x: canvas.width/2+(70*3/2)-15,
            y: canvas.height/2-50,
            w: 15,
            h: 115,
            d: 'v',
            color: "#1515df"
        },
    ]
}

let settings = {
    difficulty: 'medium',
    lifes: 3,
    score: 0,
    food: 10,
    superFood: 50,

}

async function animateGame(){
    ctx.clearRect(0+100, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0+15, 80, 70);

    // Draw score
    updateScore();

    // Draw ghosts
    entities.ghosts.forEach(ghost => {
        drawGhost(ghost.x, ghost.y, ghost.direction, ghost.color);
    });
    
    // Draw pacman
    if(entities.pacman.amplitude >= 0.6) entities.pacman.step = -0.1;
    else if(entities.pacman.amplitude <= 0) entities.pacman.step = 0.1;
    entities.pacman.amplitude += entities.pacman.step;
    switch(entities.pacman.direction){
        case 'r':
            if(checkMove(entities.pacman.x+entities.pacman.speed, entities.pacman.y))
                entities.pacman.x += entities.pacman.speed;
            break;
        case 'l':
            if(checkMove(entities.pacman.x-entities.pacman.speed, entities.pacman.y))
                entities.pacman.x -= entities.pacman.speed;
            break;
        case 'u':
            if(checkMove(entities.pacman.x, entities.pacman.y-entities.pacman.speed))
                entities.pacman.y -= entities.pacman.speed;
            break;
        case 'd':
            if(checkMove(entities.pacman.x, entities.pacman.y+entities.pacman.speed))
                entities.pacman.y += entities.pacman.speed;
            break;
    }
    drawPacman(entities.pacman.x, entities.pacman.y, entities.pacman.amplitude, entities.pacman.direction, entities.pacman.color);
    entities.walls.forEach(wall => {
        drawWall(wall.x, wall.y, wall.w, wall.h, wall.d, wall.color);
    });
    setTimeout(animateGame, 35);
}


// Start listener sequence
konami();

// Draw settings
initialize();

// Start animation
animateGame();

