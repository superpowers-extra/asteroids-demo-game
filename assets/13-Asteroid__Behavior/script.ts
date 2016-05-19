class AsteroidBehavior extends Sup.Behavior {
  position: Sup.Math.Vector2;
  velocity: Sup.Math.Vector2;
  size: number;

  start() {
    Game.asteroids.push(this);
    Game.asteroidsCurrentValue += this.size;
    
    this.position = this.actor.getLocalPosition().toVector2();
    this.velocity = new Sup.Math.Vector2(Sup.Math.Random.float(0.08, 0.15), 0).rotate(this.actor.getLocalEulerZ());
    
    this.actor.getChild("Model").setLocalScale(this.size);
  }

  onDestroy() {
    Game.asteroidsCurrentValue -= this.size;
    Game.asteroids.splice(Game.asteroids.indexOf(this), 1);
  }

  update() {
    this.position.add(this.velocity);
    
    // Keep the asteroid on screen
    if (this.position.y > Game.bounds.height / 2) this.position.y -= Game.bounds.height;
    if (this.position.y < -Game.bounds.height / 2) this.position.y += Game.bounds.height;

    if (this.position.x > Game.bounds.width / 2) this.position.x -= Game.bounds.width;
    if (this.position.x < -Game.bounds.width / 2) this.position.x += Game.bounds.width;
    
    this.actor.setLocalPosition(this.position);
    
    // Rotation
    this.actor.rotateEulerAngles(AsteroidBehavior.rotationSpeed, AsteroidBehavior.rotationSpeed, AsteroidBehavior.rotationSpeed);
    
    // Check for collisions
    for (let missile of Game.missiles) {
      if (missile.position.distanceTo(this.position) < this.size) {
        let sizeIndex = AsteroidBehavior.sizes.indexOf(this.size) + 1;
        Game.addPoints(missile.ownerShip, sizeIndex * 100);
        let pitch = Sup.Math.Random.float(-0.1, 0.1);
        Sup.Audio.playSound("Sounds/Asteroid Hit", 0.1, { pitch });
        
        if (sizeIndex < AsteroidBehavior.sizes.length) {
          let missileAngle = missile.actor.getLocalEulerZ();
          let pieceSize = AsteroidBehavior.sizes[sizeIndex];

          let leftAsteroidPiece = Sup.appendScene("Asteroid/Prefab")[0];
          leftAsteroidPiece.setLocalPosition(this.position);
          leftAsteroidPiece.setLocalEulerZ(missileAngle + Sup.Math.toRadians(45));
          leftAsteroidPiece.getBehavior(AsteroidBehavior).size = pieceSize;

          let rightAsteroidPiece = Sup.appendScene("Asteroid/Prefab")[0];
          rightAsteroidPiece.setLocalPosition(this.position);
          rightAsteroidPiece.setLocalEulerZ(missileAngle - Sup.Math.toRadians(45));
          rightAsteroidPiece.getBehavior(AsteroidBehavior).size = pieceSize;
        }
        
        missile.actor.destroy();
        this.actor.destroy();
        return;
      }
    }
  }
}
Sup.registerBehavior(AsteroidBehavior);

namespace AsteroidBehavior {
  export const rotationSpeed = 0.05;
  export const sizes = [ 2, 1.7, 1.3, 1 ];
}
