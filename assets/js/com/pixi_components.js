//-------------------------------------------------------------
class PixiAtlas extends PIXI.AnimatedSprite{

	constructor(sheet,obj,_id){

			let atlas = null;

			if(_id==undefined){
				atlas = obj.assets.loadSpritesheet(sheet).animations[sheet];
			}else{
				atlas = obj.assets.loadSpritesheet(sheet).animations["img"];
			}

			super(atlas);

			this.anchor.set(0.5);	
			this.animationSpeed = 1;
			this.loop = false;

			this.atlas = atlas;

			this.init(obj,_id);

			//this.externalCall();
	}

	init(parent,_id){

			parent.container.addChild(this);

			if(_id != undefined){
				this.changeTexture(_id)
			}
	}

	/*externalCall(){
		//emppty
	};*/

	changeTexture(_id){
			let self = this;

			this.atlas.forEach(function(obj,atlas_id){
				if(obj.textureCacheIds == _id+"0000"){
					self.gotoAndStop(atlas_id);
				}
			})
	}
}
////-------------------------------------------------------------


class PixiAtlasButton extends PixiAtlas{
	constructor(sheet,obj,_id,_label){

		super(sheet,obj,_id);

		this._sheet = sheet;
		this._obj = obj;
		this._id = _id;

		this._label = _label;

		this.checkText();
	}

	checkText(){
		
		let lable_x = 0;

		if(this._label != undefined){
			const label = new PIXI.Text(this._label,{fontFamily : 'Roboto', fontSize: 25, fill : 0xffffff, align : 'center'});//new PIXI.Text(this._label);
			label.position.set( lable_x ,0);
			//label.style = {'_fill':'white','_align':'right','_fontSize':20};
			label.anchor.set(0.5,0.5);
			this.addChild(label);
			
			/*const label = new PIXI.BitmapText(this._label, {font: "25px cg25", align: "left"});
			label.anchor.set(0.5,0.5);*/
			//label.updateTransform();
			this.addChild(label);
			
			this.label = label;

			//text.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
			//label._font.size = (25 * window.devicePixelRatio * 1);
		}
	}
}

//-------------------------------------------------------------
class PixiButton extends PIXI.Sprite{
	constructor(){
		super();
	}

	init(parent){
		parent.container.addChild(this);
	}
}


//-------------------------------------------------------------
class PixiToggle extends PIXI.Sprite{
	constructor(){
		super();
	}

	init(parent){
		parent.container.addChild(this);
	}

}


//-------------------------------------------------------------
class PixiScrollMenu extends PIXI.Sprite{
	constructor(obj){
		super();
		this.init(obj)

		this._dragged = false;
	}

	init(parent){

		parent.container.addChild(this);
		//this.texture = parent.assets.loadImg('cover');

		this.slide_container = new PIXI.Container();
		this.addChild(this.slide_container);
		this.slide_container._scroll_height = parent._height;

		let obj = {
			"container":this.slide_container,
			"assets":parent.assets,
			"btn_action":parent.btn_action
		}

		let arr = parent.arr//["content1","content2","content3","content4","content5","content6","content7","content8"];
		let arr_btn = [];
		let i=0;

		let btn_height = parent.btn_height; 

		for(i=0; i<arr.length; i++){
			arr_btn[i] = new PixiLabelBar(obj,"hellooo: "+i,"btn_nav_1");
			arr_btn[i].y = btn_height*i;
			arr_btn[i]._id = i;
			this.addAction(arr_btn[i]);
		}

		//mask
		const mask = new PIXI.Graphics();
		mask.beginFill(0x050505,0.3);
		mask.drawRect(0, 0, parent._width, parent._height);
		mask.endFill();
		this.addChild(mask);
		//set mask
		this.mask = mask;


		//drag
		let drg = new Drag();

		this.slide_container
	    .on('pointerdown', drg.onDragStart)
	    .on('pointerup', drg.onDragEnd)
	    .on('pointerupoutside', drg.onDragEnd)
	    .on('pointermove', drg.onDragMove);

	    this.slide_container.interactive = true;
		this.slide_container.buttonMode = true;
		//console.log("s",this.slide_container);
	}

	addAction(obj){

		const self = this;

		obj._press_timer = 0;

		Tap(this,obj,{
			"onUp":function(){
				//console.log("obj",obj._id);
				if(self.slide_container._dragged == false){
					if(obj.alpha ==1){
						obj.alpha = 0.7;
					}else{
						obj.alpha = 1;
					}
				}
			}
		})

	}
}


//-------------------------------------------------------------
class PixiLabelBar extends PIXI.Sprite{
	constructor(parent,_txt,_bg_asset, _icon){
		super();
		this.label = undefined;

		this.init(parent,_txt,_bg_asset, _icon)
		
	}

	init(parent,_txt,_bg_asset, _icon){

		let lable_x = 0;

		if(parent != undefined){
			parent.container.addChild(this);
		}

		if(_bg_asset != undefined){

			let obj = {
	                "container":this,
	                "assets":parent.assets
	        }

			const bg = new PixiAtlasButton("page_component",obj,"page_btn_panel","");
	        bg.position.set(bg.width*0.5,bg.height*0.5);
		}

		if(_icon != undefined){
			const icon = new PIXI.Sprite(parent.assets.loadImg(_icon));
			icon.anchor.set(0.5);
			icon.position.set(30,25);
			this.addChild(icon);
		}

		/*const mytext = new PIXI.BitmapText('example', {font: "32px flappy", align: "left"});
			  this.addChild(mytext);	*/

		const label = new PIXI.Text(_txt);
		label.position.set( lable_x ,10);
		label.style = {'_fill':'black','_align':'right','_fontSize':26};
		label.anchor.set(1,0);
		this.addChild(label);

		this.label = label;

		
	}

}

//-------------------------------------------------------------

class SContainer extends PIXI.Container {

  addChildZ(child, zOrder) {
    child.zOrder = zOrder || 0;
    
    // assign those vars whenever new element joins
    
    child.oldZOrder = INF;
    child.arrivalOrder = ++tmpArrivalCounter;
    
    super.addChild(child);
  }
  
  // you can call it every tick - its not heavy
  
  sortChildren() {

	  	const INF = 1e+100;
		let tmpChanged = [], tmpOld = [];
		let tmpArrivalCounter = 0;

		//

	    const children = this.children;
	    
	    let len = children.length;
	    for (let i = 0; i < len; i++) {
	      const elem = children[i];
	     
	      if (elem.zOrder !== elem.oldZOrder) {
	        tmpChanged.push(elem);
	      } else {
	        tmpOld.push(elem);
	      }
	      elem.oldZOrder = elem.zOrder;
	    }
	    
	    if (tmpChanged.length === 0) {
	      tmpOld.length = 0;
	      return;
	    }
	    if (tmpChanged.length > 1) {
	      tmpChanged.sort(this.awesomeCompare);
	    }
	    
	    let j = 0, a = 0, b = 0;
	    while (a < tmpChanged.length && b < tmpOld.length) {
	      if (this.awesomeCompare(tmpChanged[a], tmpOld[b]) < 0) {
	        children[j++] = tmpChanged[a++];
	      } else {
	        children[j++] = tmpOld[b++];
	      }
	    }
	    while (a < tmpChanged.length) {
	      children[j++] = tmpChanged[a++];
	    }
	    while (b < tmpOld.length) {
	      children[j++] = tmpOld[b++];
	    }
	    
	    tmpChanged.length = 0;
	    tmpOld.length = 0;
}


    awesomeCompare(a, b) {
	  if (a.zOrder > b.zOrder) return 1;
	  if (a.zOrder < b.zOrder) return -1;
	  if (a.arrivalOrder > b.arrivalOrder) return 1;
	  if (a.arrivalOrder < b.arrivalOrder) return -1;
	  return 0;
	}
}