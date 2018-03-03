let gameOver = false;
let boardArray = [];
let currentX = 0;
let currentY = 0;
let playerTurn = "X";
let numberOfMoves = 0;
let status = document.getElementById("status");

generateBoardArray();
drawBoard();

//grab key press events
document.onkeydown = function (e) {
	if (numberOfMoves > 8) {
		resetGame();
	} else if (gameOver === false) {
		switch (e.key) {
			case "ArrowUp":
				changePosition(0, 1);
				break;
			case "ArrowDown":
				changePosition(0, -1);
				break;
			case "ArrowLeft":
				changePosition(-1, 0);
				break;
			case "ArrowRight":
				changePosition(1, 0);
				break;
			case " ":
				setTimeout(() => {
					placeMark();
					reDrawBoard();
					checkWin();
				}, 0);
				break;
		}
		reDrawBoard();
		//any key press when game over => restart game
	} else {
		resetGame();
	}
};

function generateBoardArray() {
	for (let i = 0; i < 9; i++) {
		//generate x coordinate
		let x = i % 3 - 1;
		//complicated way to generate y coordinate
		let y = -(Math.floor(i / 3) - 1) % 3;
		//[index, x coord, y coord, value, current]
		let temp = [i, x, y, "_", false];
		boardArray.push(temp);
	}
	let startingField = calculateCurrentField();
	startingField[4] = true;
}

function drawBoard() {
	for (let index = 0; index < boardArray.length; index++) {
		let div = document.createElement("div");
		div.id = boardArray[index][0];
		div.className = "field";
		if (boardArray[index][4] === true) {
			div.className += " current";
		}
		div.innerHTML = `${boardArray[index][3]}`;
		document.getElementById("board").appendChild(div);
		status.innerHTML = `player ${playerTurn} turn`;
	}
}

function reDrawBoard() {
	for (let index = 0; index < boardArray.length; index++) {
		let div = document.getElementById(`${index}`);
		div.classList.remove("current");
		if (boardArray[index][4] === true) {
			div.classList.add("current");
		}
		div.innerHTML = `${boardArray[index][3]}`;
		status.innerHTML = `player ${playerTurn} turn`;
	}
}

function changePosition(dx, dy) {
	//check if move will be inside the board => -1 to 1 coords
	if (Math.abs(currentX + dx) !== 2 && Math.abs(currentY + dy) !== 2) {
		let newX = currentX + dx;
		let newY = currentY + dy;
		let currentField = calculateCurrentField();
		currentField[4] = false;
		let newField = boardArray.find(
			element => element[1] === newX && element[2] === newY
		);
		newField[4] = true;
		currentX = newX;
		currentY = newY;
	}
}

function calculateCurrentField() {
	return boardArray.find(
		element => element[1] === currentX && element[2] === currentY
	);
}

function placeMark() {
	let currentField = calculateCurrentField();
	if (currentField[3] === "_") {
		currentField[3] = playerTurn;
		playerTurn === "X" ? (playerTurn = "O") : (playerTurn = "X");
		numberOfMoves++;
		console.log(numberOfMoves);
	}
}

function checkWin() {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	let playerXMarks = boardArray
		.filter(field => field[3] === "X")
		.map(array => array[0]);
	let playerOMarks = boardArray
		.filter(field => field[3] === "O")
		.map(array => array[0]);
	for (let i = 0; i < lines.length; i++) {
		const element = lines[i];
		if (
			playerXMarks.includes(element[0]) &&
			playerXMarks.includes(element[1]) &&
			playerXMarks.includes(element[2])
		) {
			status.innerHTML = "X wins!";
			status.classList.toggle("statusWon");
			gameOver = true;
		}
		if (
			playerOMarks.includes(element[0]) &&
			playerOMarks.includes(element[1]) &&
			playerOMarks.includes(element[2])
		) {
			status.innerHTML = "O wins!";
			status.classList.toggle("statusWon");
			gameOver = true;
		}
	}

}

function resetGame() {
	boardArray = [];
	let mydiv = document.getElementById("board");
	while (mydiv.firstChild) {
		mydiv.removeChild(mydiv.firstChild);
	}
	currentX = 0;
	currentY = 0;
	generateBoardArray();
	drawBoard();
	gameOver = false;
	numberOfMoves = 0;
	status.classList.toggle("statusWon");
}
