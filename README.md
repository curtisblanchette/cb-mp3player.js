Canvas-mp3player
================

HTML5 Canvas mp3 player.

**Requires <strong>jQuery1.10.1+</strong> and <strong>create.js</strong>

<a href="https://rawgit.com/curtisblanchette/cb-mp3player.js/master/example.html">Did you say DEMO?</a>
Include cb-mp3player.js after jQuery and createjs

```html
<script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
<script src="http://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
<script src="http://code.createjs.com/createjs-2013.12.12.min.js"></script>
<script src="cb-mp3player.js"></script>

```
Create the canvas tag
```html
<canvas id="canvas" width="400" height="200">
	You don't support canvas, you should upgrade your browser to Chrome.
</canvas>
```
<h3>Using your own music</h3>
<h5>Steps</h5>
<ol>
	<li>Place all your mp3's in the "music" folder.</li>
	<li>Open cb-mp3player.js to update links to your mp3s and artwork.</li>
</ol>

Update the <strong>songList</strong> and <strong>albumList</strong> arrays accordingly. 

```javascript
		songList = [
			{id:'Carrion', artistName:'Parkway Drive', src:'music/parkwayDrive_Carrion.mp3'},
			{id:'Seven', artistName:'Erra', src:'music/erra_Seven.mp3'},
			{id:'Hybrid Earth', artistName:'Erra', src:'music/erra_hybridEarth.m4a'}
		],
		albumList = [
			{id:'Parkway Drive', src:'player-assets/parkwayCover.png'},
			{id:'Erra', src:'player-assets/erraCover.png'},
			{id:'Erra', src:'player-assets/erraCover.png'}
```
