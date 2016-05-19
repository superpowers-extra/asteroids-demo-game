class ScrollBehavior extends Sup.Behavior {
  
  y = this.actor.getLocalY();
  speed = 0.01;

  update() {
    this.y += this.speed;
    if (this.y > 50) this.y -= 100;
    
    this.actor.setLocalY(this.y);
  }
}
Sup.registerBehavior(ScrollBehavior);
