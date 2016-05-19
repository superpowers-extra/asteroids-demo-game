class GameManagerBehavior extends Sup.Behavior {
  
  spawnCooldown = 0;
  timer = Game.timerDuration;
  timerTextRenderer: Sup.TextRenderer;

  start() {
    for (let i = 0; i < Game.asteroidStartCount; i++) this.spawnAsteroid();

    this.timerTextRenderer = Sup.getActor("Timer").textRenderer;
    this.updateTimer();
  }

  update() {
    // Restart game
    if (Sup.Input.wasKeyJustPressed("R") ||  Sup.Input.isGamepadButtonDown(0, 9) /* Start */) {
      Game.start();
      return;
    }
    
    // Go to main screen
    if (Sup.Input.wasKeyJustPressed("ESCAPE")) {
      Sup.loadScene("Main Menu/Scene");
      return;
    }
    
    // Timer
    this.timer--;
    if (this.timer === 0) {
      // TODO: Display game over screen
      Game.start();
      return;
    }
    
    if (this.timer % 60 === 0) this.updateTimer();
    
    // Spawn asteroids
    if (this.spawnCooldown > 0) {
      this.spawnCooldown--;
    } else {
      if (Game.asteroidsCurrentValue < Game.asteroidsMaximumValue) this.spawnAsteroid();
    }
  }

  updateTimer() {
    // Convert from frames to seconds
    let timerInSeconds = this.timer / 60;

    let minutes = Math.floor(timerInSeconds / 60).toString();
    let seconds = (timerInSeconds % 60).toString();
    if (seconds.length === 1) seconds = `0${seconds}`; // Pad with zeroes

    this.timerTextRenderer.setText(`${minutes}:${seconds}`);
  }
  
  spawnAsteroid() {
    let asteroidActor = Sup.appendScene("Asteroid/Prefab")[0];

    // Choose a random starting position somewhere at the edges of the screen
    let x: number, y: number;
    if (Sup.Math.Random.integer(0, 1) == 0) {
      x = Sup.Math.Random.float(-Game.bounds.width / 2, Game.bounds.width / 2);
      y = Sup.Math.Random.sample([-Game.bounds.height / 2, Game.bounds.height / 2]);
    } else {
      x = Sup.Math.Random.sample([-Game.bounds.width / 2, Game.bounds.width / 2]);
      y = Sup.Math.Random.float(-Game.bounds.height / 2, Game.bounds.height / 2);
    }
    asteroidActor.setLocalPosition(x, y);
    asteroidActor.setLocalEulerZ(Sup.Math.Random.float(0, Math.PI * 2));
    asteroidActor.getBehavior(AsteroidBehavior).size = Sup.Math.Random.sample(AsteroidBehavior.sizes);
    
    this.spawnCooldown = GameManagerBehavior.spawnCooldownDuration;
  }
}
Sup.registerBehavior(GameManagerBehavior);

namespace GameManagerBehavior {
  export const spawnCooldownDuration = 60;
}