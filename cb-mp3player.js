////////////////////////////////////////////////////////////////////////////////////////////////
//
//	HTML5 Canvas MP3 PLAYER / Customizeable Colors / Track SlideShow / Full Control
//
////////////////////////////////////////////////////////////////////////////////////////////////


	var stage,
		queue,
	    createjs = createjs;

	///////////////////////////////////////////////////////////////////////////////////////////////
	//
	// Objects
	//
	///////////////////////////////////////////////////////////////////////////////////////////////	
	var bgTop,
		bgBottom,
		playPauseToggle,
		muteToggle,
		stopBTN,
		nextBTN,
		prevBTN,
		volumeBar,
		volumeFill,
		volumeHandle,
		volumeMask,
		colorLeft,
		colorRight,
		trackBar,
		trackFill,
		trackHandle,
		trackMask,
		soundPosition = 0,
		currentVolume, 
		perc = 0, // used for position of sound as percentage.
		songIndex = 0, //current location in the song list
		albumIndex = 0,
		nowPlaying = false,
		isMuted = false,
		sound,
		volume = 1,
		title,
		artist,
		titleMask,
		trackTime,
		timeElapsed,
		timeTotal,
		songList = [
			{id:'Carrion', artistName:'Parkway Drive', src:'music/parkwayDrive_Carrion.mp3'},
			{id:'Seven', artistName:'Erra', src:'music/erra_Seven.mp3'},
			{id:'Hybrid Earth', artistName:'Erra', src:'music/erra_hybridEarth.m4a'}
		],
		albumList = [
			{id:'Parkway Drive', src:'player-assets/parkwayCover.png'},
			{id:'Erra', src:'player-assets/erraCover.png'},
			{id:'Erra', src:'player-assets/erraCover.png'}
		],
		albumMask,
		albumArt;



	var filterList = [
		purpleFilter = new createjs.ColorFilter(1.2, 0, 1.2, 1),
		blueFilter = new createjs.ColorFilter(0, .8, 1, 1),
		greenFilter = new createjs.ColorFilter(0, 1, 0, 1),	
		redFilter = new createjs.ColorFilter(1, 0.2, 0, 1)
	];	
	filterIndex = 1;


//Visualizer Vars
/////////////////////

	 var bar = new createjs.Shape(),
	 	 analyser; 

///////////////////////////////////////////////////////////////////////////////////////////////
//
// Initializing
//
///////////////////////////////////////////////////////////////////////////////////////////////		
	function init() {
		stage = new createjs.Stage('canvas');
		queue = new createjs.LoadQueue(false); //don't use server mode, 'cause we aren't on a server. true if on a server
		queue.installPlugin(createjs.Sound); //load the sound plugin so we can play stuff.
	
		stage.enableMouseOver(); //must be called to enable mouseover
	//////////////////Event Listeners//////////////////////////////
		queue.addEventListener('fileload', handleFileLoad); //fires for every file as it loads in
		queue.addEventListener('complete', handleComplete); //fires when all files have loaded
		queue.addEventListener('progress', handleProgress); //% loaded
	
	////////////////Create our Manifest////////////////////////////
	queue.loadManifest(
			[
				{id:'playBTN', src:'player-assets/playBTN.png'},
				{id:'pauseBTN', src:'player-assets/pauseBTN.png'},
				{id:'stopBTN', src:'player-assets/Stop.png'},
				{id:'nextBTN', src:'player-assets/nextBTN.png'},
				{id:'prevBTN', src:'player-assets/prevBTN.png'},
				{id:'colorLeft', src:'player-assets/colorLeft.png'},
				{id:'colorRight', src:'player-assets/colorRight.png'},
				{id:'muteBTN', src:'player-assets/mute.png'},
				{id:'unMuteBTN', src:'player-assets/unMute.png'},
				{id:'trackBar', src:'player-assets/trackBar.png'},
				{id:'trackFill', src:'player-assets/trackFill.png'},
				{id:'volumeBar', src:'player-assets/volumeBar.png'},
				{id:'volumeFill',src:'player-assets/volumeFill.png'},
				{id:'volumeHandle', src:'player-assets/handle.png'},
				{id:'erraCover', src:'player-assets/erraCover.png'},
				{id:'veilCover', src:'player-assets/veilCover.png'},
			
			]
		); //loads multiple
		
	queue.loadFile(songList[songIndex]); //load a single file versus multiple 
	queue.loadFile(albumList[albumIndex]);
	///////////////Run the ticker (runs everyframe of animation)////////////
	
		createjs.Ticker.setFPS(25);
		createjs.Ticker.addEventListener('tick', onTick); //on 'tick' callback onTick
	
	
	
	}// end init();
	
	
///////////////////////////////////////////////////////////////////////////////////////////////
// Update the stage every frame of animation
///////////////////////////////////////////////////////////////////////////////////////////////	
function onTick(event){
	
	// SEEK /////////////////////
	//
	/////////////////////////////
	
	if(nowPlaying){
		

		perc = sound.getPosition() / sound.getDuration();
		trackHandle.x = (perc * (trackBar.image.width - trackHandle.image.width)) + trackBar.x;
		
		timeElapsed.text = timeFormat(sound.getPosition());
		timeTotal.text =	' / ' + 
						 timeFormat(sound.getDuration());	

		
	}
	
	///////////Slider mask movement code////////////////
	
	if(volumeMask){ 
		  volumeMask.x = volumeHandle.x - volumeBar.image.width;
		  trackMask.x = trackHandle.x - trackBar.image.width;

	}
	////////Color maintainer.///////

	if(colorRight){
		playPauseToggle.filters = [filterList[filterIndex]];
		muteToggle.filters = [filterList[filterIndex]];
		nextBTN.filters = [filterList[filterIndex]];
		prevBTN.filters = [filterList[filterIndex]];
		trackHandle.filters = [filterList[filterIndex]];
		volumeHandle.filters = [filterList[filterIndex]];

		playPauseToggle.cache(0, 0, 25, 25);
		muteToggle.cache(0, 0, 25, 25);
		nextBTN.cache(0, 0, 25, 25);
		prevBTN.cache(0, 0, 25, 25);
		volumeHandle.cache(0, 0, 25, 25);
		trackHandle.cache(0, 0, 25, 25);
	}
	//////////////Visualizer Code//////////
	if(nowPlaying){
		// make the 8bit Array to store the data
		var freqData = new Uint8Array(analyser.frequencyBinCount);
		// Filling the 8bit Array with the current frequency Data
		analyser.getByteFrequencyData(freqData);
		analyser.smoothingTimeConstant = .5;
		
		
		bar.graphics.clear();
		
		///bar visualizer
		bar.graphics.beginFill("rgba(0,0,0,0.4)");
		//for i is < the width of the bar
		for(var i = 0; i < 360; i++){
			var magnitude = freqData[i];
			bar.graphics.drawRect(i + 15, 130, 1, (-magnitude / 2.2));
		}
		/////////////////////////////
		
		///Line visualizer
	/*	
		bar.graphics.beginStroke('red');
		bar.graphics.setStrokeStyle(2);
		for(var i = 0; i < 100; i++){
			var magnitude = freqData[i];
			bar.graphics.lineTo(i, (-magnitude * 0.5) + 200);	
		}
		///////////////////////
	*/
	}
	///////////////



	stage.update();	
}
	
	
///////////////////////////////////////////////////////////////////////////////////////////////
//
// File loaded handler fires as the files load in
//
///////////////////////////////////////////////////////////////////////////////////////////////
	function handleFileLoad(event){
	//	document.getElementById('display').innerHTML += 
	//	'<br>Loaded: ' + event.item.id;
	}
	
///////////////////////////////////////////////////////////////////////////////////////////////
//
// File load complete Handler fires once all files have finished loading
//			(creates instances onces all files are loaded)
//
///////////////////////////////////////////////////////////////////////////////////////////////
	function handleComplete(event){
		queue.removeEventListener('complete', handleComplete);



		bgTop = new createjs.Shape();
		bgTop.graphics.beginFill("rgba(0,0,0,0.5)")
		.setStrokeStyle(1,"round")
		.beginStroke("#000")
		.drawRoundRect(15, 15, 360, 115, 3);

		bgBottom = new createjs.Shape();
		bgBottom.graphics.beginFill("rgba(0,0,0,0.5)")
		.setStrokeStyle(1,"round")
		.beginStroke("#000")
		.drawRoundRect(15, 137, 360, 33, 3);

		albumMask = new createjs.Shape();
		albumMask.x = 27;
		albumMask.y = 27;
		albumMask.graphics.beginFill("rgba(0,0,0,0)")
		.drawRoundRect(0, 0, 97, 97, 3);

		albumArt = new createjs.Bitmap(queue.getResult(albumList[albumIndex].src));
		albumArt.x = 27 + (albumArt.image.width / 2);
		albumArt.y = 27 + (albumArt.image.height / 2);
		albumArt.regX = albumArt.image.width / 2;
		albumArt.regY = albumArt.image.height / 2;
		albumArt.mask = albumMask;
	
		//instantiate the button objects
		playPauseToggle = new createjs.Bitmap(queue.getResult('playBTN'));
		playPauseToggle.x = 21;
		playPauseToggle.y = 141;
		playPauseToggle.filters = [filterList[filterIndex]];
        playPauseToggle.cache(0, 0, 25, 25);
	
		muteToggle = new createjs.Bitmap(queue.getResult('muteBTN'));
		muteToggle.x = 136;
		muteToggle.y = 94;
		muteToggle.filters = [filterList[filterIndex]];
        muteToggle.cache(0, 0, 16, 16);
		
		nextBTN = new createjs.Bitmap(queue.getResult('nextBTN')); 
		nextBTN.x = 82;
		nextBTN.y = 141;
        nextBTN.filters = [filterList[filterIndex]];
        nextBTN.cache(0, 0, 25, 25);
		
		prevBTN = new createjs.Bitmap(queue.getResult('prevBTN')); 
		prevBTN.x = 51;
		prevBTN.y = 141;
		prevBTN.filters = [filterList[filterIndex]];
        prevBTN.cache(0, 0, 25, 25);

        colorLeft = new createjs.Bitmap(queue.getResult('colorLeft'));
        colorLeft.x = 335;
        colorLeft.y = 20;

        colorRight = new createjs.Bitmap(queue.getResult('colorRight'));
        colorRight.x = 350;
        colorRight.y = 20;
		
		stopBTN = new createjs.Bitmap(queue.getResult('stopBTN')); 
		stopBTN.x = 160;
		stopBTN.y = 125;
		
		volumeBar = new createjs.Bitmap(queue.getResult('volumeBar'));
		volumeBar.x = 158;
		volumeBar.y = 94;

		volumeMask = new createjs.Shape();
		volumeMask.x = volumeBar.x;
		volumeMask.y = volumeBar.y;
		volumeMask.graphics.beginFill("rgba(0,0,0,0)")
		.drawRoundRect(0, 0, volumeBar.image.width, 15, 3);

		volumeFill = new createjs.Bitmap(queue.getResult('volumeFill'));
		volumeFill.x = 159;
		volumeFill.y = 96;
		volumeFill.mask = volumeMask;

		trackBar = new createjs.Bitmap(queue.getResult('trackBar'));
		trackBar.x = 114;
		trackBar.y = 147;

		trackMask = new createjs.Shape();
		trackMask.x = trackBar.x;
		trackMask.y = trackBar.y;
		trackMask.graphics.beginFill("rgba(0,0,0,0)")
		.drawRoundRect(0, 0, trackBar.image.width, 15, 3);
		
		trackFill = new createjs.Bitmap(queue.getResult('trackFill'));
		trackFill.x = 115;
		trackFill.y = 148;
		trackFill.mask = trackMask;

		trackHandle = new createjs.Bitmap(queue.getResult('volumeHandle'));
		trackHandle.x = trackBar.x;
		trackHandle.y = 147;
		trackHandle.filters = [filterList[filterIndex]];
        trackHandle.cache(0, 0, 25, 25);
		
		volumeHandle = new createjs.Bitmap(queue.getResult('volumeHandle'));
		volumeHandle.x = ((volumeBar.image.width * volume) + volumeBar.x) - volumeHandle.image.width;
		volumeHandle.y = 94;
		volumeHandle.filters = [filterList[filterIndex]];
        volumeHandle.cache(0, 0, 25, 25);
		
		titleMask = new createjs.Shape();
		titleMask.x = 135;
		titleMask.y = 40;
		titleMask.graphics.beginFill("rgba(0,0,0,0)")
		.drawRoundRect(0, 0, 230, 50, 3);

		title = new createjs.Text(songList[songIndex].id, "23px Arial", "#FFF");
		title.x = 135;
		title.y = 40;
		title.mask = titleMask;

		artist = new createjs.Text(songList[songIndex].artistName, "16px Arial", "#FFF");
		artist.x = 135;
		artist.y = 70;
		artist.mask = titleMask;
		artist.text = 'by ' + songList[songIndex].artistName;
		
		timeElapsed = new createjs.Text(0, "12px Arial", "#CCC");
		timeElapsed.x = 300;
		timeElapsed.y = 147;

		timeTotal = new createjs.Text(0, "12px Arial", "#FFF");
		timeTotal.x = 329;
		timeTotal.y = 147;
			


		//draw a rectangle for the hit area and set it for each object at -3,-3 with a size of 26,26
		var hit = new createjs.Shape(); 
			hit.graphics.beginFill('#000').drawRect
			(-3, -1, 26, 26);
			playPauseToggle.hitArea = hit;
			nextBTN.hitArea = hit;
			prevBTN.hitArea = hit;
			stopBTN.hitArea = hit;
			muteToggle.hitArea = hit;
			colorLeft.hitArea = hit;
			colorRight.hitArea = hit;
		
		// add all objects to the stage
		stage.addChild(	bar,
						bgTop, 
					   	bgBottom,
					   	albumMask, 
					    albumArt, 
					    playPauseToggle, 
					    nextBTN, 
					    prevBTN, 
					    muteToggle, 
					    title,
					    artist,
					    titleMask, 
					    trackBar,
					    trackFill,
					    trackMask,
					    volumeBar,
					    volumeFill, 
					   	volumeHandle, 
					   	volumeMask,
					    trackHandle,
					    timeElapsed,
					    timeTotal,
					    colorLeft,
					    colorRight
					);
		
		currentVolume = volumeHandle.x;

		
///////////////////////////////////////////////////////////////////////////////////////////////
//
// Add Event Listeners for all button states
//
///////////////////////////////////////////////////////////////////////////////////////////////
		
		playPauseToggle.addEventListener('click', onPlayPauseClick);
		stopBTN.addEventListener('click', onStopClick);
		
		muteToggle.addEventListener('click', onMuteClick);
		
		nextBTN.addEventListener('click', onNextClick);
		prevBTN.addEventListener('click', onPrevClick);
		
		playPauseToggle.addEventListener('mousedown', clickInteraction);
		playPauseToggle.addEventListener('pressup', clickInteraction);

		muteToggle.addEventListener('mousedown', clickInteraction);
		muteToggle.addEventListener('pressup', clickInteraction);

		stopBTN.addEventListener('mousedown', clickInteraction);
		stopBTN.addEventListener('pressup', clickInteraction);
		nextBTN.addEventListener('mousedown', clickInteraction);
		nextBTN.addEventListener('pressup', clickInteraction);
		prevBTN.addEventListener('mousedown', clickInteraction);
		prevBTN.addEventListener('pressup', clickInteraction);
	
		volumeHandle.addEventListener('pressmove', volumeDrag);
		trackHandle.addEventListener('pressmove', trackDrag);

		colorLeft.addEventListener('click', onColorLeftClick);
		colorRight.addEventListener('click', onColorRightClick);

		//wont work if nothing has started playing on init 
		// if(sound) sound.addEventListener('complete', onNextClick);

		volumeBar.addEventListener('click', volumeClick);
		trackBar.addEventListener('click', trackClick);
		

	}//end handleComplete();
	
///////////////////////////////////////////////////////////////////////////////////////////////
//
// Control Functions
//
///////////////////////////////////////////////////////////////////////////////////////////////	
	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// PLAY / PAUSE
	///////////////////////////////////////////////////////////////////////////////////////////////
	function onPlayPauseClick(event){

		if(!nowPlaying){ 

			sound = createjs.Sound.play(songList[songIndex].id); //sound chanel
			//sound.setPosition(soundPosition); //use the current position of the sound to play from that point
			sound.volume = volume;
			muteToggle.image = queue.getResult('unMuteBTN');
			muteToggle.cache(0, 0, 25, 25);
			playPauseToggle.image = queue.getResult('pauseBTN');
			playPauseToggle.cache(0, 0, 25, 25); //call on the image, and overwrite it with the new image
			nowPlaying = true;
			
				soundPosition = sound.getPosition(sound.getDuration() * perc);
				sound.setPosition(sound.getDuration() * perc);
			
			
			//Visualizer get sound data
			////////////////////////////////
			analyser = sound._owner.context.createAnalyser();
			sound.gainNode.connect(analyser);
			//////////////////////////////////////
			
		} else {
			soundPosition = sound.getPosition(sound.getDuration() * perc);//gets the sound position at point of stop
			createjs.Sound.stop();
			playPauseToggle.image = queue.getResult('playBTN');
			playPauseToggle.cache(0, 0, 25, 25);
			muteToggle.image = queue.getResult('muteBTN');
			muteToggle.cache(0, 0, 25, 25);
			nowPlaying = false;
		}

		sound.addEventListener('complete', onNextClick);
	}
	
	function onMuteClick(event) {
		if (!isMuted){
			muteToggle.image = queue.getResult('muteBTN');
			muteToggle.cache(0, 0, 25, 25);
			isMuted = true;
			currentVolume = volumeHandle.x;
			volumeHandle.x = volumeBar.x;
			if(sound) sound.volume = 0; //volume() method must be called by the sound chanel 'sound' if it is defined
		} else {
			muteToggle.image = queue.getResult('unMuteBTN');
			muteToggle.cache(0, 0, 25, 25);
			isMuted = false;

			volumeHandle.x = currentVolume;
			if(sound) sound.volume = volume;

		}
	}
	
	function volumeDrag(event){
		event.target.x = event.stageX - (volumeHandle.image.width / 2); //actionscript mouseX / javascript stageX
		
		if(event.target.x >= ((volumeBar.x + volumeBar.image.width) - volumeHandle.image.width)){
				event.target.x = (volumeBar.x + volumeBar.image.width) - volumeHandle.image.width;
		}
		if(event.target.x <= volumeBar.x){
			event.target.x = volumeBar.x;
		}
		
		volume = Math.round(event.target.x - volumeBar.x) / volumeBar.image.width;
		//console.log(volume);
		currentVolume = volumeHandle.x;
		
		if(isMuted){
			if(sound) sound.volume = 0;	
		} else {
			if(sound) sound.volume = volume;
		}
	}

	function volumeClick(event){
		volumeHandle.x = event.stageX - (volumeHandle.image.width / 2);
		
		if(sound){
			volume = Math.round(volumeHandle.x - volumeBar.x) / volumeBar.image.width;
			sound.volume = volume;
		}
	}
	function trackDrag(event){
		event.target.x = event.stageX; //actionscript mouseX / javascript stageX
		
		if(sound){
			if(event.target.x >= (trackBar.x + trackBar.image.width)){
					event.target.x = (trackBar.x + trackBar.image.width);
					//onNextClick();
			}
		}else{
			if(event.target.x >= (trackBar.x + trackBar.image.width) - trackHandle.image.width ){
					event.target.x = (trackBar.x + trackBar.image.width)- trackHandle.image.width;
					//onNextClick();
			}
		}
		if(event.target.x <= trackBar.x){
			event.target.x = trackBar.x;
		}
		
		perc = Math.round(event.target.x - trackBar.x) / trackBar.image.width;
		//set the sound position
		
		//no idea what this line was for
		//(perc * (trackBar.image.width - trackHandle.image.width)) + trackBar.x;

		if(sound){
			soundPosition = sound.getPosition(sound.getDuration() * perc);
			sound.setPosition(sound.getDuration() * perc);
		}
	}
	function trackClick(event){
		trackHandle.x = event.stageX - (trackHandle.image.width / 2);
		perc = Math.round(event.stageX - trackBar.x) / trackBar.image.width;
		
		if(sound){
			soundPosition = sound.getPosition(sound.getDuration() * perc);
			sound.setPosition(sound.getDuration() * perc);
		}
	}

	
	function timeFormat(s){
		var ms = s % 1000;
		s = (s - ms) / 1000;
		var secs = (s < 10)? '0' + s % 60 : s % 60;
		s = (s - secs) / 60;
		var mins = (s < 10)? '0' + s % 60 : s % 60;
		var hrs = (s - mins) / 60;
		
		return mins + ':' + secs; 
			
	}
	
	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// STOP
	///////////////////////////////////////////////////////////////////////////////////////////////
	function onStopClick(event){
		
		soundPosition = 0;
		createjs.Sound.stop();
		playPauseToggle.image = queue.getResult('playBTN');
		nowPlaying = false;
		
	}

	///////////////////////////////////////////////////////////////////////////////////////////////
	// NEXT
	///////////////////////////////////////////////////////////////////////////////////////////////
	function onNextClick(event){
		
		//console.log(songList[songIndex].id);

		soundPosition = 0;
		createjs.Sound.stop();
		
		if(songIndex < (songList.length -1)){
			songIndex++;
			albumIndex++;
			
		}else{
			songIndex = 0;
			albumIndex = 0;
		}
		slideTextOut();
		animateAlbum();
		queue.loadFile(songList[songIndex]); //load the next song
		queue.addEventListener('complete', playNextSong); //on complete play next song
		
		
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	// PREVIOUS
	///////////////////////////////////////////////////////////////////////////////////////////////
	function onPrevClick(event){
		//console.log(songList[songIndex].id);
		
		soundPosition = 0;
		createjs.Sound.stop();
		
		if(songIndex > 0){
			songIndex--;
			albumIndex--;
		}else{
			songIndex = (songList.length - 1);
			albumIndex = (albumList.length -1);
		}
			
		slideTextOut();
		animateAlbum();
		queue.loadFile(songList[songIndex]);
		queue.addEventListener('complete', playNextSong);
	/*	title = new createjs.Text(songList[songIndex].id, "12px Arial", "#000");
		title.x = 200;
		title.y = 110;
		stage.addChild(title);
	*/	
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	// Color SWITCHER
	///////////////////////////////////////////////////////////////////////////////////////////////
	
	function onColorLeftClick(event){
		
		filterIndex--;
		
		if(filterIndex < 0){
			filterIndex = filterList.length - 1;
		}
		//console.log(filterIndex);
		

	}

	function onColorRightClick(event){
		
		filterIndex++;

		if (filterIndex > 3){
			filterIndex = 0;
		}
	
		//console.log(filterIndex);

	}



	///////////////////////////////////////////////////////////////////////////////////////////////
	// Handles the next song.
	///////////////////////////////////////////////////////////////////////////////////////////////
	function playNextSong(event) {
		
		if(!nowPlaying){
			playPauseToggle.image = queue.getResult('pauseBTN');	
			nowPlaying = true;
		}
		
		sound = createjs.Sound.play(songList[songIndex].id);
		sound.addEventListener('complete', onNextClick);

		//set the volume
		volume = Math.round(volumeHandle.x - volumeBar.x) / volumeBar.image.width;
		sound.volume = volume;

			//Visualizer get sound data
			////////////////////////////////
			analyser = sound._owner.context.createAnalyser();
			sound.gainNode.connect(analyser);
			//////////////////////////////////////
	}

	///////////////////////////////////////////////////////////////////////////////////////////////
	// Handles the % loaded and displays output in 'display' element as HTML
	///////////////////////////////////////////////////////////////////////////////////////////////
	function handleProgress(event){
		//	document.getElementById('display').innerHTML += '<br>' + (event.loaded * 100);
	}
	
///////////////////////////////////////////////////////////////////////////////////////////////
//
// Hover Interaction Event (shorthand 'if' switches alpha's between 50/100% )
//
///////////////////////////////////////////////////////////////////////////////////////////////	

	function handleInteraction(event){
		event.target.alpha = (event.type == "mouseover") ? 1 : 0.5; 
	}
	
	function clickInteraction(event){
		if(event.target.id == muteToggle.id){
			event.target.y = (event.type == "mousedown") ? 95 : 94;
		}else{
			event.target.y = (event.type == "mousedown") ? 142 : 141;
			//console.log(event.target);
		}
		
	}

	function slideTextOut(){
		  createjs.Tween.get(title).to({x:400}, 300, createjs.Ease.circIn).call(slideInNext);
		  createjs.Tween.get(artist).to({x:-400}, 300, createjs.Ease.circIn);

    
	}
	function slideInNext(){
		artist.x = 400;
		title.x = - 400;
		//update titles
			if(title){
				title.text = songList[songIndex].id;
				artist.text = 'by ' + songList[songIndex].artistName;
			}
		createjs.Tween.get(title).to({x:135}, 300, createjs.Ease.circOut);
		createjs.Tween.get(artist).to({x:135}, 300, createjs.Ease.circOut);
	}
	function animateAlbum(){
		createjs.Tween.get(albumArt).to({y:200}, 300, createjs.Ease.circOut).call(swapAlbum);
	}
	function swapAlbum(){
		albumArt.y = (-50);
		albumArt.image = queue.getResult(albumList[albumIndex].src);	
		createjs.Tween.get(albumArt).to({y:(27 + (albumArt.image.height / 2))}, 300, createjs.Ease.circOut);
	}


	