$( document ).ready(function() {
  // Handler for .ready() called.

	//get the window height and the container height  
	var $windowH = $(window).height();
	var $container = $('#container');

	//set the container height to windowheight
	$container.height($windowH);


		//on resize, update the window height, and insert into container height
		$( window ).resize(function() {
  		var $windowH = $(window).height();

			$container.height($windowH);
		});
});