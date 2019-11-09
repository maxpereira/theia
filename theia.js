	// Theia Digital Signage Software
	// Author: Max Pereira - 2019
	// Github: maxpereira

	// ------------- Configurable Theia Options -------------

	// Choose cycle mode (random, ordered)
	var cycleMode = "ordered"; // Default: ordered
	
	// Name of file to load image names from
	var imageListFile = "files.txt"

	// Image display duration in seconds
	var duration = 1; // Default: 30

	// Force image size to fit the screen
	var forceSize = false; // Default: false
	var forceWidth = 1920;
	var forceHeight = 1080;

	// Fade between images
	var fadeBetween = false; // Default: false
	var fadeTime = 1; // Fade time in seconds

	// -------------  END Configurable Options  -------------

	var rndIndex = 0;
	var rndIndexOld = 0;
	var currentDiv = 1;
	var arrImg = [];

	// Get array of image filenames from imageListFile (specified above)
	$.get(imageListFile, function (data)
	{
		arrImg = data.split("\n");
	});
	
	// Load the next image to the viewport randomly
	function theiaTick()
	{
		var imgNext = new Image();

		rndIndexOld = rndIndex;

		// Randomly cycle through photos
		if (cycleMode == "random")
		{
			rndIndex = Math.floor(Math.random() * arrImg.length);

			// While bug is caused by the same bug that makes the array [] on first run
			if (rndIndex == rndIndexOld)
			{
				rndIndex = Math.floor(Math.random() * arrImg.length);
				if (rndIndex == rndIndexOld)
				{
					rndIndex = Math.floor(Math.random() * arrImg.length);
				}
			}
			// Cycle through photos in order
		}
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

		var rndImg = arrImg[rndIndex];
		imgNext.src = "images/" + rndImg;
		if (forceSize == true)
		{
			imgNext.width = forceWidth;
			imgNext.height = forceHeight;
		}

		if (fadeBetween == false)
		{
			document.getElementById("theiaContainer").innerHTML = "";
			document.getElementById("theiaContainer").appendChild(imgNext);
		}
		else if (fadeBetween == true)
		{
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

	window.onload = theiaTick;

	// Start Theia heartbeat
	setInterval(theiaTick, duration * 1000);