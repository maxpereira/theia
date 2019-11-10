
	//	 _______  __   __  _______  ___   _______ 
	//	|       ||  | |  ||       ||   | |   _   |
	//	|_     _||  |_|  ||    ___||   | |  |_|  |
	//	  |   |  |       ||   |___ |   | |       |
	//	  |   |  |       ||    ___||   | |       |
	//	  |   |  |   _   ||   |___ |   | |   _   |
	//	  |___|  |__| |__||_______||___| |__| |__|

	// Theia Digital Signage Software
	// Author: Max Pereira - 2019
	// Github: maxpereira

	// ------------- Configurable Theia Options -------------

	// Choose cycle mode (random, ordered)
	var cycleMode = "ordered"; // Default: ordered

	// Loop at the end of the image set in ordered mode (false freezes on last image)
	var loopOrdered = true; // Default: true
	
	// Name of file to load image names from
	var imageListFile = "files.txt";

	// Name of directory to load images from
	var imgDir = "images";

	// Background color of page (hex or color name)
	// This shouldn't matter if you're using full size images
	var bckColor = "black";

	// Image display duration in seconds
	var duration = 3; // Default: 30

	// Vertically and horizontally center images on page
	// This should be set to false if you're using full size images
	var centerImages = true;

	// Force image size to fit the screen
	var forceSize = false; // Default: false
	var forceWidth = 1920;
	var forceHeight = 1080;

	// Fade between images
	var fadeBetween = true; // Default: true
	var fadeTime = 1; // Fade time in seconds, Default: 1

	// Debug Keys
	// (NOTE: toggling options using debug keys only lasts for current session)
	// . - Advance to next image
	// , - Reverse to previous image
	// z - Toggle fading between images
	// x - Toggle forcing image size
	// c - Toggle cycle mode between ordered and random
	// v - Toggle manual mode (stops automatic advance to next image)
	// b - Toggle cursor visibility
	// n - Toggle centering images vertically and horizontally
	var enableDebugKeys = true; // Default: false

	// -------------  END Configurable Options  -------------

	var rndIndex = -1;
	var rndIndexOld = -1;
	var currentDiv = 1;
	var arrImg = [];
	var fadeToggle = false;
	var cursorVisible = false;
	var theiaInterval = "";
	var autoAdvance = true;
	
	// Triggered on window load
	$(window).on("load", function() {

		// Hide cursor on page
		$("*").css("cursor", "none");

		// Set page background color
		$("body").css("background-color", bckColor);

		// Get array of image filenames from imageListFile (specified above)
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
	    	if (e.keyCode == "46") { // .
	    		if (autoAdvance == true) {
		    		clearInterval(theiaInterval);
					theiaInterval = setInterval(theiaTick, duration * 1000);
	    		}
				theiaTick();
			}
			if (e.keyCode == "122") { // z
				fadeToggle = true;
			}
			if (e.keyCode == "120") { // x
				if (forceSize == true) {
					forceSize = false;
				} else if (forceSize == false) {
					forceSize = true;
				}
			}
			if (e.keyCode == "99") { // c
				if (cycleMode == "ordered") {
					cycleMode = "random";
				} else if (cycleMode == "random") {
					cycleMode = "ordered"
				}
			}
			if (e.keyCode == "118") { // v
				if (autoAdvance == true) {
					clearInterval(theiaInterval);
					autoAdvance = false;
				} else if (autoAdvance == false) {
					theiaInterval = setInterval(theiaTick, duration * 1000);
					autoAdvance = true;
				}
			}
			if (e.keyCode == "44") { // ,
				if (rndIndexOld-1 < 0) {
					if (cycleMode == "ordered") {
						rndIndex = arrImg.length-1;
					} else if (cycleMode == "random") {
						// No need to go back in random mode
					}
				} else {
					rndIndex = rndIndexOld-1
				}
				if (autoAdvance == true) {
		    		clearInterval(theiaInterval);
					theiaInterval = setInterval(theiaTick, duration * 1000);
	    		}
				theiaTick();
			}
			if (e.keyCode == "98") { // b
				if (cursorVisible == false) {
					$("body").css("cursor", "auto");
					cursorVisible = true;
				} else if (cursorVisible == true) {
					$("body").css("cursor", "none");
					cursorVisible = false;
				}
			}
			if (e.keyCode == "110") { // n
				if (centerImages == true) {
					centerImages = false;
				} else if (centerImages == false) {
					centerImages = true;
				}
			}
	    }
	}
	
	// Load the next image to the viewport
	function theiaTick() {
		var imgNext = new Image();
		rndIndexOld = rndIndex;

		// Vertically and horizontally center images if enabled
		imgNext.onload = function() {
				if (currentDiv == 2) {
					if (fadeBetween == false) {
						$("#theiaContainer2").hide();
						$("#theiaContainer").show();
					} else if (fadeBetween == true) {
						$("#theiaContainer2").fadeOut(fadeTime * 1000);
						$("#theiaContainer").fadeIn(fadeTime * 1000);						
					}
					if (centerImages == true) {
				  		$(this).css({
					        'position' : 'absolute',
					        'left' : '50%',
					        'top' : '50%',
					        'margin-left' : -$(this).outerWidth()/2,
					        'margin-top' : -$(this).outerHeight()/2
					    });
					} else if (centerImages == false) {
						$(this).css({
							'position': 'fixed',
							'top': '0',
							'left': '0'
						});
					}
					currentDiv = 1;
				} else if (currentDiv == 1) {
					if (fadeBetween == false) {
						$("#theiaContainer2").show();
						$("#theiaContainer").hide();
					} else if (fadeBetween == true) {
						$("#theiaContainer2").fadeIn(fadeTime * 1000);
						$("#theiaContainer").fadeOut(fadeTime * 1000);						
					}
					if (centerImages == true) {
				  		$(this).css({
					        'position' : 'absolute',
					        'left' : '50%',
					        'top' : '50%',
					        'margin-left' : -$(this).outerWidth()/2,
					        'margin-top' : -$(this).outerHeight()/2
					    });
					} else if (centerImages == false) {
						$(this).css({
							'position': 'fixed',
							'top': '0',
							'left': '0'
						});
					}			
					currentDiv = 2;
				}
			}

		// Randomly cycle through photos
		if (cycleMode == "random") {
			rndIndex = Math.floor(Math.random() * arrImg.length);
			if (rndIndex == rndIndexOld) {
				rndIndex = Math.floor(Math.random() * arrImg.length);
				if (rndIndex == rndIndexOld) {
					rndIndex = Math.floor(Math.random() * arrImg.length);
				}
			}
		}

		// Cycle through photos in order
		else if (cycleMode == "ordered") {
			if (rndIndexOld < arrImg.length - 1) {
				rndIndex = rndIndexOld + 1;
			}
			else {
				if (loopOrdered == true) {
					rndIndex = 0;
				} else if (loopOrdered == false) {
					clearInterval(theiaInterval);
					fadeToggle = true;
				}
			}
		}

		// Get next image name
		var rndImg = arrImg[rndIndex];
		imgNext.src = imgDir + "/" + rndImg;

		// Get forced width and height if enabled
		if (forceSize == true) {
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
			if (currentDiv == 1) {
				document.getElementById("theiaContainer2").innerHTML = "";
				document.getElementById("theiaContainer2").appendChild(imgNext);
			} else if (currentDiv == 2) {
				document.getElementById("theiaContainer").innerHTML = "";
				document.getElementById("theiaContainer").appendChild(imgNext);
			}
		} else if (fadeBetween == true) {
			if (currentDiv == 1) {
				document.getElementById("theiaContainer2").innerHTML = "";
				document.getElementById("theiaContainer2").appendChild(imgNext);
			} else if (currentDiv == 2) {
				document.getElementById("theiaContainer").innerHTML = "";
				document.getElementById("theiaContainer").appendChild(imgNext);
				$("#theiaContainer2").fadeOut(fadeTime * 1000);
				$("#theiaContainer").fadeIn(fadeTime * 1000);
			}
		}
	}