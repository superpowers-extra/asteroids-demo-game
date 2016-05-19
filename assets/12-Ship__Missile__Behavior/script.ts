class MissileBehavior extends Sup.Behavior {
  ownerShip: ShipBehavior;
  
  timer = 120;
  position: Sup.Math.Vector2;
  velocity: Sup.Math.Vector2;
  
  awake() {
    Game.missiles.push(this);
  }

  start() {
    this.position = this.actor.getLocalPosition().toVector2();
    this.velocity = new Sup.Math.Vector2(1, 0).rotate(this.actor.getLocalEulerZ());
  }

  onDestroy() {
    Game.missiles.splice(Game.missiles.indexOf(this), 1);
  }

  update() {
    this.timer--;
    if (this.timer === 0) {
      this.actor.destroy();
      return;
    }
    
    this.position.add(this.velocity);
    this.actor.setLocalPosition(this.position);
  }
}
Sup.registerBehavior(MissileBehavior);
