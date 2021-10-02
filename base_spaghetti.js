let walkers = [];
let sources = [];
let N_walker = 100;
let N_sources = 3;

function setup() {
  createCanvas(550, 550);
  background([12,0,5]);
  for(let i=0; i< N_walker; ++i){
    //walkers.push(new random_walker(10,dphi=0.2,dcol=1,phi0=2));
    walkers.push(new random_walker(1,0.2 ));
  }
}
      
class random_walker {
  constructor(r=1,dphi=0.2,dcol=1,phi0=-1) {
    this.x = width/2;
    this.y = height/2;
    this.r = r;
    if (phi0 < 0)
      this.phi = 2*PI*Math.random();
    else
      this.phi = phi0;
    this.dphi = dphi;
    this.color = 255*Math.random();
    this.dcol = dcol;
    this.color_lower_bound = 10;
    this.color_upper_bound = 250;
  }
  
  step() {
    let self = this;
    this.old_x = this.x;
    this.old_y = this.y;
    this.phi += this.dphi * (2*Math.random()-1);
    this.color += this.dcol * (2*Math.random()-1);
    this.x += this.r * cos(this.phi);
    this.y += this.r * sin(this.phi);
    
    if (this.x > width) {
      self.draw();
      this.x -= width;
      this.old_x -= width;
    } else if (this.x < 0) {
      self.draw();
      this.x += width;
      this.old_x += width;
    }
    
    if (this.y > height) {
      self.draw();
      this.y -= height;
      this.old_y -= height;
    } else if (this.y < 0) {
      self.draw();
      this.y += height;
      this.old_y += height;
    }
    
    if (this.color < this.color_lower_bound)
      this.color = 2*this.color_lower_bound - this.color;
    if (this.color > this.color_upper_bound)
      this.color = 2*this.color_upper_bound - this.color;
    
    
  }

  draw(col=240) {
    stroke(this.color);
    line(this.old_x, this.old_y, this.x, this.y);    
  }
}

function draw() {
  //console.log("hi");
  //background([255,250,250]);
  walkers.forEach(function(walker){
    walker.step();
    walker.draw();
  })
}
