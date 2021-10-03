let walkers = [];
let sources = [];
let N_walker = 300;
let N_sources = 100;
let frame = 0;
let max_frames_between_disruption = 300;
let min_frames_between_disruption = 100;
let next_disruption = 200;
var velocity;

 
function setup() {
  createCanvas(550, 550);
  background([12,0,5]);
  velocity = new source(5,0.2);
  for(let i=0; i< N_walker; ++i){
    //walkers.push(new random_walker(10,dphi=0.2,dcol=1,phi0=2));
    walkers.push(new random_walker(5,0.2 ));
  }
  
  //eraser
  /*
  for(let i=0; i< N_walker/2; ++i){
    //walkers.push(new random_walker(10,dphi=0.2,dcol=1,phi0=2));
    let a = new random_walker(7,0.2 )
    a.dcol = 0;
    a.color = 0; 
    a.color_lower_bound = 0;
    a.color_lower_bound = 10;
    a.x = width/2;
    a.y = height/2;
    a.stroke_weight = 30;
    this.stroke_weight_upper_bound = 10;
    this.stroke_weight_lower_bound = 5;
    walkers.push(a); 
  }
  */
  
  for(let i=0; i< N_sources; ++i){
    //walkers.push(new random_walker(10,dphi=0.2,dcol=1,phi0=2));
    sources.push(new source());
  }
  frame = 0;
}

function force_to_interpolation_t(force) {
  let max_force = 0.1; // make this smaller to make force stronger
  if (force.r > max_force){
    return 1.0;
  } else
  {
    return force.r/max_force;
  }
}

class random_walker {
  constructor(r=1,dphi=0.2,dcol=1,phi0=-1,dstroke=0.1,is_source=false) {
    this.is_source = is_source;
    this.x = width/2;///2;
    this.y = height/2;//2;
    //this.x = width * random();
    //this.y = height * random();
    this.r = r;
    this.base_radius = r/3;
    if (phi0 < 0)
      this.phi = 2*PI*Math.random();
    else
      this.phi = phi0;
    this.dphi = dphi;
    this.color = 255*Math.random();
    this.dcol = dcol;
    this.color_lower_bound = 100;
    this.color_upper_bound = 250;
    this.stroke_weight = 1;
    this.stroke_weight_upper_bound = 2;
    this.stroke_weight_lower_bound = 1;
    this.dstroke = dstroke;
    this.is_source = false;
  }
  
  step() {
    
    let self = this;
    //if (!this.is_source)
    //  this.r = 3 * this.base_radius * velocity.x/width;
    
    this.old_x = this.x;
    this.old_y = this.y;
    this.phi += this.dphi * (2*Math.random()-1);
    
    if (this.phi > 2*PI)
      this.phi = 4*PI - this.phi;
    if (this.phi < 0)
      this.phi = -this.phi;
    
    if (!this.is_source){
      sources.forEach(function(source){
        let force = source.force_from(self.x, self.y);
        let desired_phi = atan2(force.y, force.x);
        let t = force_to_interpolation_t(force);
        //console.log(force);
        if (abs(self.phi-desired_phi) > PI)
        {
          if (self.phi>desired_phi) 
            desired_phi += 2*PI
          else
            self.phi += 2*PI
        }

        self.phi = (1-t) * self.phi + t * desired_phi;
        //console.log(self.phi);
      })
    }
    this.color += this.dcol * (2*Math.random()-1);
    this.x += this.r * cos(this.phi);
    this.y += this.r * sin(this.phi);
    this.stroke_weight += this.dstroke * (2*Math.random()-1);
    
    
    if (this.x > width) {
      if (!this.is_source)
        self.draw();
      
      this.x -= width;
      this.old_x -= width;
    } else if (this.x < 0) {
      if (!this.is_source)
        self.draw();
      this.x += width;
      this.old_x += width;
    }
    
    if (this.y > height) {
      if (!this.is_source)
        self.draw();
      this.y -= height;
      this.old_y -= height;
    } else if (this.y < 0) {
      if (!this.is_source)
        self.draw();
      this.y += height;
      this.old_y += height;
    }
    
    if (this.color < this.color_lower_bound)
      this.color = 2*this.color_lower_bound - this.color;
    if (this.color > this.color_upper_bound)
      this.color = 2*this.color_upper_bound - this.color;
    
    if (this.stroke_weight < this.stroke_weight_lower_bound)
      this.stroke_weight = 2*this.stroke_weight_lower_bound - this.stroke_weight ;
    if (this.stroke_weight > this.stroke_weight_upper_bound)
      this.stroke_weight = 2*this.stroke_weight_upper_bound - this.stroke_weight ;    
  }

  draw(col=240) {
    stroke(this.color);
    strokeWeight(this.stroke_weight);
    line(this.old_x, this.old_y, this.x, this.y); 
    //fill(this.color);
    //strokeWeight(this.stroke_weight);
    //ellipse(this.x, this.y, this.stroke_weight,this.stroke_weight);    
  }
}
 
class source extends random_walker {
  constructor(R=50,force_strength=1000,r=0.1,dphi=0.2,dcol=1,phi0=-1) {
    super(r,dphi,dcol,phi0);
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    //this.x = width/2 + 3;
    //this.y = width/2 + 3;
    this.force_strength = force_strength;
    this.dstroke = 10;
    this.stroke_weight = 10;
    this.stroke_weight_upper_bound = 100;
    this.stroke_weight_lower_bound = 10;

    this.color = [200,0,0];
    this.is_source = true;
    this.R = R;
  }
  
  force_from(x, y) {
  
    let force = {x:0, y:0};
    for(let ix=-1; ix<=+1; ++ix){
      for(let iy=-1; iy<=+1; ++iy){
        let other_x = x + ix * width;
        let other_y = y + iy * height;
        let dx = this.x - other_x;
        let dy = this.y - other_y;
        let r = Math.sqrt( Math.pow(this.x - other_x,2) + Math.pow(this.y - other_y,2) );
        //console.log(r);
        this.force_strength = this.stroke_weight * 10;
        r = max([r,1]);
        //if (r<this.R){
          force.x += this.force_strength * (other_x - this.x)/r/r/r/r;//*exp(-r*r);
          force.y += this.force_strength * (other_y - this.y)/r/r/r/r;//*exp(-r*r);
        //}
      }
    }
    force.r = sqrt(force.x*force.x + force.y*force.y);
    return force;
  }
  
  draw(col=240) {
    let c = color(0, 0, 0, 5);
    fill(c);
    //strokeWeight(this.stroke_weight);
    stroke([0,0,0,0]);
    ellipse(this.old_x, this.old_y, this.stroke_weight, this.stroke_weight);    
  }
  
  shuffle() {
    this.x = random() * width;
    this.y = random() * width;
  }
}
       


function draw() {
  //console.log("hi");
  //background([255,250,250]);
  velocity.step();
  walkers.forEach(function(walker){
    walker.step();
    walker.draw();
  })
  sources.forEach(function(source){
    source.step();
    source.draw(); 
  })
  
  ++frame;
  
  if (frame >= next_disruption){
    sources.forEach(source => source.shuffle());
    //console.log("hey");
    frame = 0;
    next_disruption = random()*
                      (max_frames_between_disruption-min_frames_between_disruption)+
                       min_frames_between_disruption;
    console.log("next_disruption",next_disruption);
  }
  
}

