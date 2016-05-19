namespace Game {
  export let timerDuration = 120 * 60;
  
  export let bounds: { width: number; height: number; };
  
  export let playerCount: number;
  export let nextShipIndex: number;
  export let missiles: MissileBehavior[];

  export let asteroids: AsteroidBehavior[];
  export const asteroidStartCount = 10;

  export const asteroidsMaximumValue = 60;
  export let asteroidsCurrentValue: number;
  
  export let scoresByShipIndex: { [shipIndex: string]: number };
  
  export function start(newPlayerCount?: number) {
    nextShipIndex = 0;
    scoresByShipIndex = { "0": 0, "1": 0 };
    missiles = [];
    asteroids = [];
    asteroidsCurrentValue = 0;

    Sup.loadScene("Game Scene");

    let camera = Sup.getActor("Camera").camera;

    const border = 2;
    bounds = {
      height: camera.getOrthographicScale() + border,
      width: camera.getOrthographicScale() * camera.getWidthToHeightRatio() + border
    };
    
    if (newPlayerCount != null) {
      playerCount = newPlayerCount;
    }
    
    if (playerCount === 1) {
      let ship = Sup.appendScene("Ship/Prefab")[0];
      ship.setName("Ship 1");
    } else if (playerCount === 2) {
      let ship1 = Sup.appendScene("Ship/Prefab")[0];
      ship1.setName("Ship 1");
      ship1.setLocalPosition(-6, 0);

      let ship2 = Sup.appendScene("Ship/Prefab")[0];
      ship2.setName("Ship 2");
      ship2.setLocalPosition(6, 0);
    }
  }
  
  export function addPoints(ship: ShipBehavior, points: number) {
    let score = Math.max(scoresByShipIndex[ship.index] + points, 0);
    scoresByShipIndex[ship.index] = score;
    Sup.getActor(`${ship.actor.getName()} Score`).textRenderer.setText(score);
  }
  
  export function isKeyListDown(keys: string[]) {
    for (let key of keys) if (Sup.Input.isKeyDown(key)) return true;
    return false;
  }
  
  export function wasKeyListJustPressed(keys: string[]) {
    for (let key of keys) if (Sup.Input.wasKeyJustPressed(key)) return true;
    return false;
  }
}
