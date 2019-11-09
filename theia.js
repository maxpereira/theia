	// Theia Digital Signage Software
	// Author: Max Pereira - 2019
	// Github: maxpereira

	// ------------- Configurable Theia Options -------------

	// Choose cycle mode (random, ordered)
	var cycleMode = "ordered"; // Default: ordered
	
	// Name of file to load image names from
	var imageListFile = "files.txt"

	// Image display duration in seconds
	var duration = 3; // Default: 30

	// Force image size to fit the screen
	var forceSize = false; // Default: false
	var forceWidth = 1920;
	var forceHeight = 1080;

	// Fade between images
	var fadeBetween = true; // Default: true
	var fadeTime = 1; // Fade time in seconds, Default: 1

	// Debug Keys
	// (NOTE: toggling options using debug keys only lasts for current session)
	// z - Advance to next image
	// x - Toggles fading between images
	// c - Toggles forcing image size
	// v - Toggles cycle mode between ordered and random
	// b - Toggles manual mode (stops automatic advance to next image)
	var enableDebugKeys = true; // Default: false

	// -------------  END Configurable Options  -------------

	var rndIndex = 0;
	var rndIndexOld = 0;
	var currentDiv = 1;
	var arrImg = [];
	var fadeToggle = false;
	var theiaInterval = "";
	var autoAdvance = true;
	
	// Get array of image filenames from imageListFile (specified above)
	$(window).on("load", function() {
		$.get(imageListFile, function (data)
		{
			// Split imageListFile by line into array
			arrImg = data.split("\n");
			
			// Start Theia heartbeat
			theiaTick();
			theiaInterval = setInterval(theiaTick, duration * 1000);
		});
	});

	// Handle debug keypresses
	document.onkeypress = function (e) {
    e = e || window.event;
	    if (enableDebugKeys == true) {
	    	if (e.keyCode == "122") { // z
	    		if (autoAdvance == true) {
		    		clearInterval(theiaInterval);
					theiaInterval = setInterval(theiaTick, duration * 1000);
	    		}
				theiaTick();
			}
			if (e.keyCode == "120") { // x
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
			if (e.keyCode == "98") { // b
				if (autoAdvance == true) {
					clearInterval(theiaInterval);
					autoAdvance = false;
				} else if (autoAdvance == false) {
					theiaTick();
					theiaInterval = setInterval(theiaTick, duration * 1000);
					autoAdvance = true;
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

		// Handle fade toggle debug key
		if (fadeToggle == true) {
			if (fadeBetween == true) {
				fadeBetween = false;
			} else if (fadeBetween == false) {
				fadeBetween = true;
			}
			fadeToggle = false;
		}

		// Handle fading between images if enabled
		if (fadeBetween == false) {
			if (currentDiv == 1)
			{
				document.getElementById("theiaContainer2").innerHTML = "";
				document.getElementById("theiaContainer2").appendChild(imgNext);
				$("#theiaContainer").toggle();
				$("#theiaContainer2").toggle();
				currentDiv = 2;
			}
			else if (currentDiv == 2)
			{
				document.getElementById("theiaContainer").innerHTML = "";
				document.getElementById("theiaContainer").appendChild(imgNext);
				$("#theiaContainer2").toggle();
				$("#theiaContainer").toggle();
				currentDiv = 1;
			}
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
	}