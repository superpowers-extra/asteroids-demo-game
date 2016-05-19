class ShipBehavior extends Sup.Behavior {
  index: number;
  
  rollActor: Sup.Actor;
  
  angle = 0;
  angularVelocity = 0;
  
  spawnPosition: Sup.Math.Vector2;
  position: Sup.Math.Vector2;
  velocity = new Sup.Math.Vector2();

  shootCooldown = 0;

  respawnTimer = 0;
  invicibilityTimer = 0;

  awake() {
    this.index = Game.nextShipIndex;
    Game.nextShipIndex++;
  }

  start() {
    this.spawnPosition = this.actor.getLocalPosition().toVector2();
    this.position = this.spawnPosition.clone();
    this.rollActor = this.actor.getChild("Roll");
  }

  update() {
    if (this.respawnTimer > 0) {
      // Ship is currently dead, waiting for respawn
      this.respawnTimer--;
      if (this.respawnTimer === 0) this.respawn();
      else return;
    }
    
    if (this.invicibilityTimer > 0) {
      this.invicibilityTimer--;
      
      let blink = this.invicibilityTimer % (ShipBehavior.invicibilityBlinkInterval * 2);
      this.actor.setVisible(blink < ShipBehavior.invicibilityBlinkInterval);
    }
    
    // Rotation
    let horizontalAxis = Sup.Input.getGamepadAxisValue(this.index, 0);
    
    if (Game.isKeyListDown(ShipBehavior.keys[this.index].right) || horizontalAxis >  0.25) this.angularVelocity -= ShipBehavior.angularAcceleration;
    if (Game.isKeyListDown(ShipBehavior.keys[this.index].left)  || horizontalAxis < -0.25) this.angularVelocity += ShipBehavior.angularAcceleration;
    this.angularVelocity *= ShipBehavior.angularDamping;
    
    this.angle += this.angularVelocity;
    this.actor.setLocalEulerZ(this.angle);
    
    this.rollActor.setLocalEulerX(-this.angularVelocity * 10);

    // Movement
    if (Game.isKeyListDown(ShipBehavior.keys[this.index].up) || Sup.Input.getGamepadButtonValue(this.index, 7) /* Right trigger */) {
      let impulse = new Sup.Math.Vector2(ShipBehavior.linearAcceleration, 0);
      impulse.rotate(this.angle);
      
      this.velocity.add(impulse);
    }
    
    this.velocity.multiplyScalar(ShipBehavior.linearDamping);
    this.position.add(this.velocity);
    
    // Keep the ship on screen
    if (this.position.y > Game.bounds.height / 2) this.position.y -= Game.bounds.height;
    if (this.position.y < -Game.bounds.height / 2) this.position.y += Game.bounds.height;

    if (this.position.x > Game.bounds.width / 2) this.position.x -= Game.bounds.width;
    if (this.position.x < -Game.bounds.width / 2) this.position.x += Game.bounds.width;

    this.actor.setLocalPosition(this.position);
    
    // Shooting
    if (this.shootCooldown > 0) this.shootCooldown--;
    
    if (Game.wasKeyListJustPressed(ShipBehavior.keys[this.index].shoot) || Sup.Input.wasGamepadButtonJustPressed(this.index, 2) /* X */) this.shoot();
    
    // Check for collisions if not invincible
    if (this.invicibilityTimer === 0) {
      for (let asteroid of Game.asteroids) {
        if (asteroid.position.distanceTo(this.position) < asteroid.size + ShipBehavior.size) {
          this.die();
          return;
        }
      }
    }
  }

  shoot() {
    if (this.shootCooldown === 0) {
      let pitch = Sup.Math.Random.float(-0.1, 0.1);
      Sup.Audio.playSound("Sounds/Shoot", 0.1, { pitch });
      
      let leftMissileActor = Sup.appendScene("Ship/Missile/Prefab")[0];
      leftMissileActor.getBehavior(MissileBehavior).ownerShip = this;
      leftMissileActor.setLocalPosition(this.position).setLocalZ(-1);
      leftMissileActor.setLocalEulerZ(this.angle);
      leftMissileActor.moveOrientedY(-1);
      
      let rightMissileActor = Sup.appendScene("Ship/Missile/Prefab")[0];
      rightMissileActor.getBehavior(MissileBehavior).ownerShip = this;
      rightMissileActor.setLocalPosition(this.position).setLocalZ(-1);
      rightMissileActor.setLocalEulerZ(this.angle);
      rightMissileActor.moveOrientedY(1);
      
      this.shootCooldown = ShipBehavior.shootCooldownDuration;
    }
  }

  die() {
    this.actor.setVisible(false);
    this.respawnTimer = ShipBehavior.respawnTimerDuration;
    Sup.Audio.playSound("Sounds/Ship Hit", 0.1);
    Game.addPoints(this, -10000);
  }

  respawn() {
    this.actor.setVisible(true);
    
    this.angle = 0;
    this.angularVelocity = 0;

    this.position.copy(this.spawnPosition);
    this.velocity.set(0, 0);
    
    this.shootCooldown = 0;
    
    this.actor.setLocalEulerZ(0);
    this.rollActor.setLocalEulerX(0);
    
    this.invicibilityTimer = ShipBehavior.invicibilityTimerDuration;
  }
}
Sup.registerBehavior(ShipBehavior);

namespace ShipBehavior {
  export const respawnTimerDuration = 180;

  export const invicibilityTimerDuration = 120;
  export const invicibilityBlinkInterval = 5;

  export const size = 1;
  
  export const angularAcceleration = 0.005;
  export const angularDamping = 0.95;

  export const linearAcceleration = 0.014;
  export const linearDamping = 0.98;

  export const shootCooldownDuration = 10;
  
  export const keys = [
    { left: [ "Q", "A" ], right: [ "D" ]    , up: [ "Z", "W" ], shoot: [ "V" ] },
    { left: [ "LEFT" ],   right: [ "RIGHT" ], up: [ "UP" ],     shoot: [ "CONTROL" ] } ];
}
