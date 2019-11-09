	// Theia Digital Signage Software
	// Author: Max Pereira - 2019
	// Github: maxpereira

	// ------------- Configurable Theia Options -------------

	// Choose cycle mode (random, ordered)
	var cycleMode = "ordered"; // Default: ordered
	
	// Name of file to load image names from
	var imageListFile = "files.txt"

	// Image display duration in seconds
	var duration = 5; // Default: 30

	// Force image size to fit the screen
	var forceSize = false; // Default: false
	var forceWidth = 1920;
	var forceHeight = 1080;

	// Fade between images
	var fadeBetween = true; // Default: true
	var fadeTime = 2; // Fade time in seconds, Default: 1

	// Debug Keys
	// (NOTE: toggling options using debug keys only lasts for current session)
	// z - Advance to next image
	// x - Toggles fading between images
	// c - Toggles forcing image size
	// v - Toggles cycle mode between ordered and random
	var enableDebugKeys = true; // Default: false

	// -------------  END Configurable Options  -------------

	var rndIndex = 0;
	var rndIndexOld = 0;
	var currentDiv = 1;
	var arrImg = [];
	var fadeToggle = false;
	
	// Get array of image filenames from imageListFile (specified above)
	$(window).on("load", function() {
		$.get(imageListFile, function (data)
		{
			// Split imageListFile by line into array
			arrImg = data.split("\n");
			
			// Start Theia heartbeat
			theiaTick();
			setInterval(theiaTick, duration * 1000);
		});
	});

	// Handle debug keypresses
	document.onkeypress = function (e) {
    e = e || window.event;
	    if (enableDebugKeys == true) {
	    	if (e.keyCode == "122") { // z
				theiaTick();
			}
			if (e.keyCode == "120") { // x
				if (fadeBetween == true) {
					fadeBetween = false;
				} else if (fadeBetween == false) {
					fadeBetween = true;
				}
				fadeToggle = true;
			}
			if (e.keyCode == "99") { // c
				if (forceSize == true) {
					forceSize = false;
				} else if (forceSize == false) {
					forceSize = true;
				}
			}
			if (e.keyCode == "118") { // v
				if (cycleMode == "ordered") {
					cycleMode = "random";
				} else if (cycleMode == "random") {
					cycleMode = "ordered"
				}
			}
	    }
	}
	
	// Load the next image to the viewport
	function theiaTick()
	{
		var imgNext = new Image();
		rndIndexOld = rndIndex;

		// Randomly cycle through photos
		if (cycleMode == "random")
		{
			rndIndex = Math.floor(Math.random() * arrImg.length);
			if (rndIndex == rndIndexOld)
			{
				rndIndex = Math.floor(Math.random() * arrImg.length);
				if (rndIndex == rndIndexOld)
				{
					rndIndex = Math.floor(Math.random() * arrImg.length);
				}
			}
		}

		// Cycle through photos in order
		else if (cycleMode == "ordered")
		{
			if (rndIndexOld < arrImg.length - 1)
			{
				rndIndex = rndIndexOld + 1;
			}
			else
			{
				rndIndex = 0;
			}
		}

		// Get next image name
		var rndImg = arrImg[rndIndex];
		imgNext.src = "images/" + rndImg;

		// Get forced width and height if enabled
		if (forceSize == true)
		{
			imgNext.width = forceWidth;
			imgNext.height = forceHeight;
		}

		// Handle fading between images if enabled
		if (fadeBetween == false) {
			document.getElementById("theiaContainer").innerHTML = "";
			document.getElementById("theiaContainer").appendChild(imgNext);
		} else if (fadeBetween == true) {
			if (currentDiv == 1)
			{
				document.getElementById("theiaContainer2").innerHTML = "";
				document.getElementById("theiaContainer2").appendChild(imgNext);
				$("#theiaContainer").fadeOut(fadeTime * 1000);
				$("#theiaContainer2").fadeIn(fadeTime * 1000);
				currentDiv = 2;
			}
			else if (currentDiv == 2)
			{
				document.getElementById("theiaContainer").innerHTML = "";
				document.getElementById("theiaContainer").appendChild(imgNext);
				$("#theiaContainer2").fadeOut(fadeTime * 1000);
				$("#theiaContainer").fadeIn(fadeTime * 1000);
				currentDiv = 1;
			}
		}
		if (fadeToggle == true && fadeBetween == false) {
			console.info("Toggle1");
			$("#theiaContainer2").toggle();
			$("#theiaContainer").toggle();
			fadeToggle = false;
		} else if (fadeToggle == true && fadeBetween == true) {
			console.info("Toggle2");
			$("#theiaContainer2").fadeToggle(fadeTime * 1000);
			$("#theiaContainer").fadeToggle(fadeTime * 1000);
			fadeToggle = false;
		}
	}