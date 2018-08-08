let canvas;
let droplets = [];
const lifespanStart = 10;

function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    noStroke();
}

function draw() {
    // if (frameCount % 20 !== 0) return;

    background('#242f35');
    let droplet = new Droplet();
    droplets.push(droplet);
    
    droplets = droplets.filter(droplet => {
        reduceLifespan(droplet);
        droplet.show();
        return droplet.lifespan !== 0;
    });
}

function reduceLifespan(droplet) {
    droplet.lifespan = Math.max(droplet.lifespan - 1, 0);
}

function Droplet() {
    this.x = random(0, width+1); // +1 as rand does not include max
    this.y = random(0, height+1); // +1 as rand does not include max
    this.lifespan = 10;
    this.colour = '#c9ad6e';

    this.show = function() {
        push();
        fill(`rgba(201,173,110,${this.lifespan / 10})`);
        rect(this.x, this.y - (this.lifespan * 10), 10, 10);
        pop();
    }
}