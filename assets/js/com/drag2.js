class Drag{

	constructor(limit){

		this.data = null; 
		
		this.min_x = limit.min_x;
		this.max_x = limit.max_x;

		this.min_y = limit.min_y;
		this.max_y = limit.max_y;

		this._drop_areas = undefined;
	}


	single(obj,arr_drop_area){

			const _dragdata = {
				'_parent':this,
				'_target':obj
			}

			this._drop_areas = arr_drop_area;

			obj.interactive = true;
			obj.buttonMode = true;

			obj
		    .on('pointerdown', this.onDragStart,_dragdata)
		    .on('pointerup', this.onDragEnd,_dragdata)
		    .on('pointerupoutside', this.onDragEnd,_dragdata)
		    .on('pointermove', this.onDragMove,_dragdata);

			//console.log("s",this.slide_container);
	}

	onDragStart(event) {
	    // store a reference to the data
	    // the reason for this is because of multitouch
	    // we want to track the movement of this particular touch
	    this._target.data = event.data;
	    this._target.dragging = true;

	    /*
	    this._target._dragged = false;
	    this._target.drag_amount = 0;*/

	    this._target.mouse_pointer_x = this._target.data.getLocalPosition(this._target.parent).x  - this._target.x;
	    this._target.mouse_pointer_y = this._target.data.getLocalPosition(this._target.parent).y  - this._target.y;
	}

	onDragEnd(event) {
	    //onst min_y = 1;
		//const min_y = 5;
		//const max_y = - this.height + this._scroll_height;

		if( this._target.y < this._parent.min_y ){
	    	this._target.y = this._parent.min_y+1;
	    }else
	    if( this._target.y > this._parent.max_y ){
	    	this._target.y = this._parent.max_y - 1;
	    }

	    if( this._target.x < this._parent.min_x ){
	    	this._target.x = this._parent.min_x+1;
	    }else
	    if( this._target.x > this._parent.max_x ){
	    	this._target.x = this._parent.max_x - 1;
	    }

	    //console.log("test",this._parent._drop_areas[0])

	    if(this._parent._drop_areas != undefined){

	    	let i = 0;
	    	let len = this._parent._drop_areas.length;

	    	for( i=0; i<len; i++){
		  		if(	RyxBump(this._target,this._parent._drop_areas[i]) ){
					console.log("collided");
					this._target.y = this._parent._drop_areas[i].y;
					this._target.x = this._parent._drop_areas[i].x;
				}
		  	}
	    }


	    this._target.dragging = false;
	    
	}

	onDragMove(event,msg) {
		//const min_y = 5;
		//const max_y = - this.height + this._scroll_height;//(/*this.height + */((this.children.length-3) * this.children[0]._bounds.maxY) );
		//const drag_time = 3;

		


	    if (this._target.dragging ) {

	    	//console.log(this,this._parent.min_x);

			 let within_drag_area =  this._target.y > this._parent.min_y && this._target.y < this._parent.max_y && 
								this._target.x > this._parent.min_x && this._target.x < this._parent.max_x;
	   
	   		if(within_drag_area){
			    const newPosition = this._target.data.getLocalPosition(this._target.parent) ;
			    this._target.y = newPosition.y - this._target.mouse_pointer_y;
			    this._target.x = newPosition.x - this._target.mouse_pointer_x;
			 }

	    }

	    

	}
}