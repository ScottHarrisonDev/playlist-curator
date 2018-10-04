let canvas;
let droplets = [];
const lifespanStart = 10;

function setup() {
    canvas = createCanvas(window.innerWidth - 50, window.innerHeight - 50);
    noStroke();
}

function windowResized() {
  resizeCanvas(window.innerWidth - 50,windowHeight - 50);
}

function draw() {
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

    this.show = function() {
        fill(`rgba(201,173,110,${(this.lifespan / 10) / 4})`);
        rect(this.x, this.y - (this.lifespan * 10), 10, 10);
    }
}
