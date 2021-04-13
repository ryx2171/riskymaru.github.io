function RyxBump(a, b) {
    const aBox = a.getBounds();
    const bBox = b.getBounds();

    //orig
            return aBox.x + aBox.width > bBox.x &&
        	   aBox.x < bBox.x + bBox.width &&
        	   aBox.y + aBox.height > bBox.y &&
        	   aBox.y < bBox.y + bBox.height;

}

const Tap = function(self,obj,fnc){

        obj.interactive = true;
        obj.buttonMode = true;

        if(fnc.onDown != undefined){
            obj.on('pointerdown',
            function(){
                fnc.onDown(obj);
            },self);
        }

        if(fnc.onUp != undefined){
            obj.on('pointerup',
            function(){
                fnc.onUp(obj);
            },self);
        }

        return obj;
}


function RyxPixiResize(app,config){
  // Perform initial resizing
  resize(pixi,config)();
  // Add event listener so that our resize function runs every time the
  // browser window is resized.
  window.addEventListener("resize", resize(pixi,config));
}

function resize (app,config){
  return function () {

      const vpw = window.innerWidth;  // Width of the viewport
      const vph = window.innerHeight; // Height of the viewport

      let nvw; // New game width
      let nvh; // New game height

      let WIDTH = config.pixiSettings.width;
      let HEIGHT = config.pixiSettings.height;



      // The aspect ratio is the ratio of the screen's sizes in different dimensions.
      // The height-to-width aspect ratio of the game is HEIGHT / WIDTH.
      
      if (vph / vpw < HEIGHT / WIDTH) {
        // If height-to-width ratio of the viewport is less than the height-to-width ratio
        // of the game, then the height will be equal to the height of the viewport, and
        // the width will be scaled.
        nvh = vph;
        nvw = (nvh * WIDTH) / HEIGHT;
      } else {
        // In the else case, the opposite is happening.
        nvw = vpw;
        nvh = (nvw * HEIGHT) / WIDTH;
      }
      
      // Set the game screen size to the new values.
      // This command only makes the screen bigger --- it does not scale the contents of the game.
      // There will be a lot of extra room --- or missing room --- if we don't scale the stage.
      app.renderer.resize(nvw, nvh);
      
      // This command scales the stage to fit the new size of the game.
      app.stage.scale.set(nvw / WIDTH, nvh / HEIGHT);
      
  };
}


function convert(arr,type){

  if(type == "str2int"){
      let n = null;
      let newArr = [];
      arr.forEach(function(itm,id){
          newArr[id] = parseInt(itm);
      })
      return newArr;
  }
}
