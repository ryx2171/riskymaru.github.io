"use strict"

class PixiGame{

		/**
		* @param {{Pixi:Object}} - okay to change

		*/
		constructor(pixi,assets){
			//this.pixi -> holds the pixi framework
			this.pixi = pixi;

			/**
			 * @type {Assets}
			 * @description
			 * use to access game assets.
			 *it holds the preloaded game assets
			 */
			this.assets = assets;

			this.ticker = PIXI.Ticker.shared;
		}

		onCompletePreload(){
			//super.this.assets.loadComplete();
			console.log('Assets Loading Complete 100%');
			//create
			this.create();
		}

		
		create(){
			/**
			 * @type {Container}
			 * @description
			 * it holds the whole game display
			 */

			 this.currentQuestionID = 0;
			 this.level = 0;
			 this.score = 0;
			 this.resultList = [[1,0,1,1,1],
								[0,1,1,1,0],
								[1,1,0,0,1]];

			this.gamecontainer = this.pixi.stage.addChild( new PIXI.Container() );
			//-----------------------------------------------------------
			this.background = this.gamecontainer.addChild(new PIXI.Sprite(this.assets.loadImg('main-bg.png')) );
			this.background.position.set(config.pixiSettings.width*0.5,config.pixiSettings.height*0.5);	
			this.background.anchor.set(0.5);

			this.dateLabel = new PIXI.Text("PH-EUT-00028    FEB 2021");
			this.dateLabel.anchor.set(0.5);
			this.dateLabel.position.set(-384,375);
			this.dateLabel.style.fontSize = 8;
			this.background.addChild(this.dateLabel);

			this.home = this.gamecontainer.addChild(new PIXI.Sprite(this.assets.loadImg('home.png')) );
			this.home.position.set(70,640);	
			this.home.anchor.set(0.5);

		
			this.createMainIntro();
			this.createInfoPage();
			this.createQuizPage();
			this.createResultPage();

			this.animateIntro();

			this.home.on('pointerdown',this.clickHome,this);
			this.home.interactive = true;
	}

	createMainIntro(){
		this.mainscene =  this.background.addChild(new PIXI.Container() ); 
		
		this.logo = this.mainscene.addChild( new PIXI.Sprite( this.assets.loadImg('logo1.png')) );
		this.logo.anchor.set(0.5);
		this.logo.position.set(0,0);
		this.logo.scale.set(0.9);

		this.info = this.mainscene.addChild( new PIXI.Sprite( this.assets.loadImg('info.png')) );   
		this.info.anchor.set(0.5);
		this.info.position.set(120,200);

		this.top_effect = this.mainscene.addChild( new PIXI.Sprite( this.assets.loadImg('effect-top.png')) );  
		this.top_effect.anchor.set(0.5);
		this.top_effect.position.set(100,-250);
		this.top_effect.visible = false;

		this.effect = this.mainscene.addChild( new PIXI.Sprite( this.assets.loadImg('questionmark.png')) );  
		this.effect.anchor.set(0.5);
		this.effect.position.set(390,35);

		this.infoCover = this.mainscene.addChild(new PIXI.Graphics());
		// Set the fill color
		this.infoCover.beginFill(0xfcfcfc); // Red
		// Draw a circle
		this.infoCover.drawRect(0,0,570,110); // drawCircle(x, y, radius)
		// Applies fill to lines and shapes since the last call to beginFill.
		this.infoCover.endFill();
		this.infoCover.position.set(-200,150);
		this.info.mask = this.infoCover;


		this.buttons = [];

		let i=0;

		for(i=0; i<3; i++){
			this.buttons[i] = this.mainscene.addChild( new PIXI.Sprite( this.assets.loadImg('lvl-'+ (i+1) +'.png')) );   
			this.buttons[i].anchor.set(0.5);
			this.buttons[i].position.set(-200+(200*i),270);
			this.buttons[i].alpha = 0;
			this.buttons[i]._id = i+1;
			this.buttons[i].visible = false;
			this.buttons[i].on("pointerdown",this.clickDifficulty,this);
			this.buttons[i].interactive = false;
		}

		this.info.on("pointerdown",this.clickInfo,this);
		this.info.interactive = false;
	}

	createInfoPage(){

		this.infoContainer  =  this.background.addChild(new PIXI.Container() ); 
		this.infoContainer.visible = false;

		this.minilogo = this.infoContainer.addChild( new PIXI.Sprite( this.assets.loadImg('logo2.png')) );  
		this.minilogo.anchor.set(0.5);
		this.minilogo.position.set(-320,-320);

		this.levelLabel = this.infoContainer.addChild( new PIXI.Sprite( this.assets.loadImg('lvl-text-1.png')) );  
		this.levelLabel.anchor.set(0.5);
		this.levelLabel.position.set(0,-200);

		this.info2 = this.infoContainer.addChild( new PIXI.Sprite( this.assets.loadImg('info-lvl-1.png')) );  
		this.info2.anchor.set(0.5);
		this.info2.position.set(0,40);

		this.info2.on('pointerdown',this.clickStartQuiz,this);
		this.info2.interactive = false;
	}


	createQuizPage(){

		this.quizPage  =  this.background.addChild(new PIXI.Container() ); 
		this.quizPage.visible = false;

		this.quizminilogo = this.quizPage.addChild( new PIXI.Sprite( this.assets.loadImg('logo2.png')) );  
		this.quizminilogo.anchor.set(0.5);
		this.quizminilogo.position.set(-320,-320);

		this.quizlevel = this.quizPage.addChild( new PIXI.Sprite( this.assets.loadImg('lvl-text-1.png')) );  
		this.quizlevel.anchor.set(0.5);
		this.quizlevel.position.set(0,-200);

		this.answer = this.quizPage.addChild( new PIXI.Sprite( this.assets.loadImg('q2a.png')) );  
		this.answer.anchor.set(0.5);
		this.answer.position.set(0,-300);//40
		this.answer.on('pointerdown',this.animateQuizStart,this);
		this.answer.visible = false;

		this.question = this.quizPage.addChild( new PIXI.Sprite( this.assets.loadImg('q1.png')) );  
		this.question.anchor.set(0.5);
		this.question.position.set(0,-300);//40

		this.selectionBG = this.quizPage.addChild( new PIXI.Sprite( this.assets.loadImg('selection.png')) );  
		this.selectionBG.anchor.set(0.5);
		this.selectionBG.position.set(0,340);//240

		this.buttonTrue = this.selectionBG.addChild( new PIXI.Sprite( this.assets.loadImg('home.png')) );  
		this.buttonTrue.anchor.set(0.5);
		this.buttonTrue.position.set(-90,0);
		this.buttonTrue.alpha = 0;
		this.buttonTrue._id = 1;
		this.buttonTrue.on('pointerdown',this.clickAnswer,this);
		this.buttonTrue.interactive = true;
		this.buttonTrue.scale.set(1.15);

		this.buttonFalse = this.selectionBG.addChild( new PIXI.Sprite( this.assets.loadImg('home.png')) );  
		this.buttonFalse.anchor.set(0.5);
		this.buttonFalse.position.set(90,0);
		this.buttonFalse.alpha = 0;
		this.buttonFalse._id = 0;
		this.buttonFalse.on('pointerdown',this.clickAnswer,this);
		this.buttonFalse.interactive = true;
		this.buttonFalse.scale.set(1.15);

		this.butterfly = this.quizPage.addChild( new PIXI.Sprite( this.assets.loadImg('butterfly.png')) );  
		this.butterfly.anchor.set(0.5);
		this.butterfly.position.set(-94,500);//240

		
		this.timer = this.question.addChild(new PIXI.Text('10',{fontFamily : 'Arial', 
															 fontSize: 70, 
															 fill : 0x522F91, 
															 fontWeight: 'bold',
															 align : 'center'}
											));
		this.timer.anchor.set(0.5);
		this.timer.position.set(388,0);

		TweenMax.to(this.quizminilogo,0.5,{y:-315,repeat:-1,yoyo:true,ease:Linear.easeNone});
	}

	createResultPage(){
		this.resultPage = this.background.addChild(new PIXI.Sprite( this.assets.loadImg('result-level'+ 1 +'.png')) );
		this.resultPage.anchor.set(0.5)
		this.resultPage.visible = false;

		this.quizscorelabel = this.resultPage.addChild( new PIXI.Sprite( this.assets.loadImg('lvl-text-1.png')) );  
		this.quizscorelabel.anchor.set(0.5);
		this.quizscorelabel.position.set(0,-220);

		this.congrats = this.resultPage.addChild( new PIXI.Sprite( this.assets.loadImg('congrats.png')) );  
		this.congrats.anchor.set(0.5);
		this.congrats.position.set(0,0);
		this.congrats.visible = false;

		this.scoreLabel = this.resultPage.addChild(new PIXI.Text('5',{fontFamily : 'Arial', 
															 fontSize: 150, 
															 fill : 0xffffff, 
															 fontWeight: 'bold',
															 align : 'center'}
											));
		this.scoreLabel.anchor.set(0.5);
		this.scoreLabel.position.set(0,50);

		this.nextlevellabel = this.resultPage.addChild(new PIXI.Text('proceed to level 2',{fontFamily : 'Arial', 
															 fontSize: 20, 
															 fill : 0x0, 
															 fontWeight: 'bold',
															 align : 'center'}
											));
		this.nextlevellabel.anchor.set(0.5);
		this.nextlevellabel.position.set(0,310);

		this.resultbuttons = [];
		let i = 0;
		for(i=0; i<3; i++){
			this.resultbuttons[i] = this.resultPage.addChild( new PIXI.Sprite( this.assets.loadImg('lvl-'+ (i+1) +'.png')) );   
			this.resultbuttons[i].anchor.set(0.5);
			this.resultbuttons[i].position.set(-200+(200*i),240);
			this.resultbuttons[i].alpha = 1;
			this.resultbuttons[i]._id = i+1;
			this.resultbuttons[i].visible = true;
			this.resultbuttons[i].on("pointerdown",this.clickDifficulty,this);
			this.resultbuttons[i].interactive = false;
		}

		this.resultPage.on('pointerdown',()=>{
			if(this.level >= 3){
				this.resultPage.visible = false;
				this.clickHome();
			}else{
				this.quizPage.visible = true;
				this.infoContainer.visible = false;
				this.animateLevelIntro(true);
			}
		},this);
		this.resultPage.interactive = true;
	}
	
	animateIntro(){

		SFX["bgm1"].stop();
		SFX["bgm1"].play();

		TweenMax.killTweensOf(this.logo);
		TweenMax.killTweensOf(this.effect);
		TweenMax.killTweensOf(this.info);

		this.mainscene.visible = true;
		this.logo.alpha = 0;
		this.effect.alpha = 0;
		this.info.alpha = 0;
		this.info.x = 1000;
		this.info.visible = true;
		this.info.interactive = true;
		this.home.visible = false;

		let i=0;

		for(i=0; i<3; i++){
			this.buttons[i].alpha = 0;
			this.buttons[i].visible = false;
		}

		TweenMax.to(this.logo,1,{startAt:{y:300},y:0,alpha:1,delay:0});
		TweenMax.to(this.effect,2,{alpha:1,delay:1});
		TweenMax.to(this.info,1,{x:120,alpha:1,delay:1.5});
	}


	//animations-----------------------------------------------------------------------------------
	animateLevelButton(){
		let i=0;
		for(i=0; i<3; i++){
			this.buttons[i].visible = true;
			this.buttons[i].alpha = 0;
			this.buttons[i].interactive = true;
		}
		TweenMax.allTo(this.buttons,0.5,{startAt:{y:400},alpha:1,y:260,ease:Back.easeOut},0.25);
	}

	animateLevelIntro(startQuiz){
		
		let asset = 'lvl-text-' + (this.level+1) + '.png';
		this.mainscene.visible = false;
		this.quizlevel.texture = this.assets.loadImg(asset);
		this.info2.interactive = true;
		if(startQuiz == true){
			this.animateQuizStart();
		}
	}

	animateRevealAnswer(){

		let qID = 0;
		let asset = ";"
		let currentAnswer = this.resultList[this.level][this.currentQuestionID-1];

		//this.selectionBG.visible = false;

		if( currentAnswer == 0 ){
			
			this.question.visible = false;
			this.answer.visible = true;
			this.answer.y = -300;
			this.answer.alpha = 0;
			this.answer.interactive = false;

			if(this.level == 0){
				qID = 'q';
			}else
			if(this.level == 1){
				qID = 'qq';
			}else
			if(this.level == 2){
				qID = 'qqq';
			}

			asset = qID + (this.currentQuestionID) + 'a.png';

			//console.log('--',asset)

			this.answer.texture = this.assets.loadImg(qID + (this.currentQuestionID) + 'a.png');

			TweenMax.to(this.answer,0.5,{alpha:1,y:30,onComplete:()=>{
				
			}});

			TweenMax.delayedCall(5,()=>{
				this.answer.interactive = true;
				this.animateQuizStart();
			});
		}else
		if(currentAnswer == 1){
			TweenMax.delayedCall(2,()=>{
				this.animateQuizStart();
			});
		}

		
		let xpos = (currentAnswer == 0 ? 95 : -95 );
		this.butterfly.x = xpos;

		TweenMax.to(this.butterfly,1,{startAt:{y:500},y:240});
		TweenMax.to(this.butterfly.scale,0.25,{startAt:{x:1},x:0.5,yoyo:true,repeat:5});
	}

	animateTimesUp(){
		console.log('animateTimesUp');
		this.buttonTrue.interactive = false;
		this.buttonFalse.interactive = false;
		this.resetTimer();
		this.animateRevealAnswer();
	}

	animateResult(){
		this.resultPage.visible = true;
		this.quizPage.visible = false;
		this.resultPage.alpha = 0;

		this.scoreLabel.text = this.score;

		this.resultPage.y = -300;

		this.nextlevellabel.text = this.level == 3 ? " " : "PROCEED TO LEVEL " + (this.level + 1);
		let i = 0;

		if(this.level <= 3){
			SFX['sfx-display-score'].play();
			this.quizscorelabel.texture = this.assets.loadImg('lvl-text-' + (this.level) + '.png');
			for(i=0; i<3; i++){
				this.resultbuttons[i].visible = true;
			}
		}

		if(this.level >= 3){
			SFX['sfx-reveal-score'].play();
			this.congrats.visible = true;
			this.congrats.alpha = 1;
			this.congrats.x = 1200;
			TweenMax.to(this.congrats,6,{delay:1,x:-1200});
			//TweenMax.to(this.congrats,1,{alpha:1,yoyo:true,repeat:1,delay:1});
			//TweenMax.to(this.congrats.scale,{x:1.2,y:1.2,repeat:1,yoyo:true,delat:1});
			for(i=0; i<3; i++){
				this.resultbuttons[i].visible = false;
				this.resultbuttons[i].alpha = 0;
			}

		}

		this.score = 0;

		TweenMax.to(this.resultPage,1,{y:50,alpha:1});
	}

	animateQuizStart(){

		let qID = "q";
		
		this.currentQuestionID += 1;

		SFX['sfx-beep'].play();

		//console.log("currentQuestionID",this.currentQuestionID);
		this.butterfly.y = 500;

		if( this.currentQuestionID == 6){
			this.level+= 1;
			this.currentQuestionID = 0;
			this.animateResult();
			this.resetTimer();
			return;
		}else{
			this.resultPage.visible = false;
		}

		if(this.level == 0){
			qID = 'q';
		}else
		if(this.level == 1){
			qID = 'qq';
		}else
		if(this.level == 2){
			qID = 'qqq';
		}

		this.gameTime = 10;

		this.timer.text = this.gameTime;
		this.timer.anchor.set(0.5);
		this.timer.position.set(388,0);

		
		this.selectionBG.alpha = 0;
		this.selectionBG.y = 300;
		this.selectionBG.visible = true;

		this.answer.visible = false;

		this.question.y = -300;
		this.question.alpha = 0;
		this.question.anchor.set(0.5);	
		this.question.visible = true;
		this.question.texture = this.assets.loadImg(qID + (this.currentQuestionID) + '.png');

		this.buttonTrue.interactive = false;
		this.buttonFalse.interactive = false;
		
		TweenMax.killTweensOf(this.question);
		TweenMax.killTweensOf(this.timer);

		TweenMax.to(this.question,0.5,{alpha:1,y:30});

		TweenMax.to(this.selectionBG,0.5,{alpha:1,y:240,onComplete:()=>{
			this.buttonTrue.interactive = true;
			this.buttonFalse.interactive = true;
		}});

		TweenMax.to(this.timer,1,{repeat:9,
								 delay:0.5,
								 onRepeat:()=>{
									SFX['sfx-tick'].play();
									this.gameTime -=1;
									this.timer.text = this.gameTime;
								},onComplete:()=>{
									this.gameTime = 0;
									this.timer.text = this.gameTime;
									SFX['sfx-wrong'].play();
									this.animateTimesUp();
								}
					})
	}
	

	resetTimer(){
		this.gameTime = 10;
		TweenMax.killTweensOf(this.timer);
	}

	//actions-----------------------------------------------------------------------------------
	clickInfo(e){
		SFX["sfx-btn2"].play();
		this.info.visible = false;
		this.home.visible = true;
		this.animateLevelButton();
	}

	clickDifficulty(e){
		SFX["sfx-btn2"].play();
		let id = e.target._id;
		this.level = id -1;
		this.infoContainer.visible = true;
		this.animateLevelIntro(false);
		this.levelLabel.texture = this.assets.loadImg('lvl-text-' + (this.level+1) + '.png');
		
		
	}

	clickStartQuiz(){
		SFX["sfx-btn2"].play();
		this.infoContainer.visible = false
		this.quizPage.visible = true;
		this.quizlevel.texture = this.assets.loadImg('lvl-text-' + (this.level+1) + '.png');
		this.animateQuizStart();
	}

	clickHome(){
		SFX["sfx-btn1"].play();
		this.resetTimer();
		this.infoContainer.visible = false
		this.quizPage.visible = false;
		this.resultPage.visible = false;
		this.currentQuestionID = 0;
		this.level = 0;
		this.score = 0;
		this.animateIntro();
	}

	clickAnswer(e){
		//console.log('e',e.target._id);

		let id = e.target._id
		
		this.buttonTrue.interactive = false;
		this.buttonFalse.interactive = false;

		this.checkAnswer(id);

		this.animateTimesUp();
	}

	checkAnswer(id){
		let answer = this.resultList[this.level][this.currentQuestionID-1];
		console.log('id',id,answer);
		if(id == answer){
			SFX["sfx-win"].play();
			this.score += 1;
		}else{
			SFX["sfx-wrong"].play();
		}
	}

}

