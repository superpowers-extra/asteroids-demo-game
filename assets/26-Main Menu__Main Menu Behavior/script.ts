declare var window;

class MainMenuBehavior extends Sup.Behavior {
  
  buttons: Sup.Actor[];
  buttonIndex = 0;

  ray = new Sup.Math.Ray();
  
  awake() {
    this.buttons = Sup.getActor("Buttons").getChildren();
    this.updateFocusedButton();
  }

  update() {
    // Keyboard navigation
    if (Sup.Input.wasKeyJustPressed("DOWN", { autoRepeat: true })) {
      this.buttonIndex = Math.min(this.buttonIndex + 1, this.buttons.length - 1);
      this.updateFocusedButton();
    }

    if (Sup.Input.wasKeyJustPressed("UP", { autoRepeat: true })) {
      this.buttonIndex = Math.max(this.buttonIndex - 1, 0);
      this.updateFocusedButton();
    }
    
    if (Sup.Input.wasKeyJustPressed("RETURN")) this.activateButton();
    
    // Mouse navigation
    this.ray.setFromCamera(this.actor.camera, Sup.Input.getMousePosition());
    
    let hits = this.ray.intersectActors(this.buttons);
    if (hits.length > 0) {
      let hoveredButtonIndex = this.buttons.indexOf(hits[0].actor);
      if (hoveredButtonIndex !== this.buttonIndex) {
        this.buttonIndex = hoveredButtonIndex;
        this.updateFocusedButton();
      }
      
      if (Sup.Input.wasMouseButtonJustPressed(0)) this.activateButton();
    }
  }

  updateFocusedButton() {
    for (let i = 0; i < this.buttons.length; i++) {
      let button = this.buttons[i];
      button.textRenderer.setOpacity(i === this.buttonIndex ? 1 : 0.3);
    }
  }

  activateButton() {
    switch (this.buttonIndex) {
      case 0:
        Game.start(1);
        break;
      case 1:
        Game.start(2);
        break;
      case 2:
        window.open("https://sparklinlabs.com/");
        break;
    }
  }
}
Sup.registerBehavior(MainMenuBehavior);
