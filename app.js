//sets the variable number of squares to 6
var numSquares = 6;
//determine the random colors
var colors = [];
//placeholder for the colors picked by the player
var pickedColor;
// for square classes  
var squares = document.querySelectorAll(".square");
// for colorDisplay in h1 and reset function
var colorDisplay = document.getElementById("colorDisplay");
// for id:message display in css
var messageDisplay = document.querySelector("#message");
// for h1 header color
var h1 = document.querySelector("h1");
// for id:reset button to reset the game
var resetButton = document.querySelector("#reset");
// buttons for selecting easy or hard mode
var modeButtons = document.querySelectorAll(".mode");
// for default score
var score = 0; 
// for scoreDisplay connected local storage
var scoreDisplay = document.querySelector("#scoreDisplay"); 
// for reset function to restart once button is pressed
var resetPressed = true; 

// to initial an object
init();

//initialize buttons, squares, and set the scores
function init(){
	setupModeButtons();
	setupSquares();
	var lsScore = localStorage.getItem('score');
	if( lsScore !== null ){
		score = lsScore; 
		scoreDisplay.textContent = score;
	}
	else {
		localStorage.setItem('score', score); 
	}
	reset();
}

// setup mode buttons for with click event listener
function setupModeButtons(){
	for(var i = 0; i < modeButtons.length; i++){
		modeButtons[i].addEventListener("click", function(){
			modeButtons[0].classList.remove("selected");
			modeButtons[1].classList.remove("selected");
			this.classList.add("selected");
			// ternery operator to display "Easy" as truthy for 3 squares else "Hard" as falsy with 6 squares
			this.textContent === "Easy" ? numSquares = 3: numSquares = 6;
			reset();
		});
	}
}

/* setup squares with click event lister to determine if clickedColor is identical to pickedColor.
If truthy, display "correct" and h1 background color changes to matched color, add 5 points to score and store the score. 
Else falsy, minus 1 point, display "try again", minus 1 point and store the score.
*/
function setupSquares(){
	for(var i = 0; i < squares.length; i++){
	//add click listeners to squares
		squares[i].addEventListener("click", function(){
			//grab color of clicked square
			var clickedColor = this.style.background;
			//compare color to pickedColor
			if(clickedColor === pickedColor){ 
				updateColorName();
				//console.log(colorName);
				messageDisplay.textContent = "Correct!";
				resetButton.textContent = "Play Again?"
				changeColors(clickedColor);
				h1.style.background = clickedColor;
				if(resetPressed){
					score+=5; 
					resetPressed = false;
				}
				scoreDisplay.textContent = score;
				localStorage.setItem('score', score);
			} else {
				this.style.background = "#232323";
				messageDisplay.textContent = "Try Again"
				score--;
				scoreDisplay.textContent = score; 
				localStorage.setItem('score', score);
			}
		});
	}
}

// update the color name when correct color was picked using regular expression
async function updateColorName(){
	const regex = /\([^\)]+\)/g; 
	var rgbColors = pickedColor.match(regex); 
	const url = "https://www.thecolorapi.com/id?rgb="+rgbColors[0];
	var requestOptions = {
	  method: 'GET',
	  redirect: 'follow'
	};

	let result = await fetch(url, requestOptions); 
	let colorData = await result.json(); 

	if(colorData.name.exact_match_name) {
		colorDisplay.textContent = colorData.name.value; 
	}
	else {
		colorDisplay.textContent = colorData.name.value + "-ish"; 
	}
}

// reset the squares when pressed the "new colors" button and change to new random colors
function reset(){
	resetPressed = true;
	colors = generateRandomColors(numSquares);
	//pick a new random color from array
	pickedColor = pickColor();
	//change colorDisplay to match picked Color
	colorDisplay.textContent = pickedColor;
	resetButton.textContent = "New Colors"
	messageDisplay.textContent = "";
	//change colors of squares
	for(var i = 0; i < squares.length; i++){
		if(colors[i]){
			squares[i].style.display = "block"
			squares[i].style.background = colors[i];
		} else {
			squares[i].style.display = "none";
		}
	}
	h1.style.background = "steelblue";
}

// click event listner to start reset function
resetButton.addEventListener("click", function(){
	reset();
})

// change colors of all squares when the correct color was picked
function changeColors(color){
	//loop through all squares
	for(var i = 0; i < squares.length; i++){
		//change each color to match given color
		squares[i].style.background = color;
	}
}
// Math.random() multiply colors.length produce a random array index that can be rounded down to the largest integer using Math.floor().
function pickColor(){
	var random = Math.floor(Math.random() * colors.length);
	return colors[random];
}

// using array push to add new num to the end of array and changing the length of the array.
function generateRandomColors(num){
	//make an array
	var arr = []
	//repeat num times
	for(var i = 0; i < num; i++){
		//get random color and push into arr
		arr.push(randomColor())
	}
	//return that array
	return arr;
}

// randomColor function is similar to pickColor, see comment on line 149 
function randomColor(){
	//pick a "red" from 0 - 255
	var r = Math.floor(Math.random() * 256);
	//pick a "green" from  0 -255
	var g = Math.floor(Math.random() * 256);
	//pick a "blue" from  0 -255
	var b = Math.floor(Math.random() * 256);
	return "rgb(" + r + ", " + g + ", " + b + ")";
}