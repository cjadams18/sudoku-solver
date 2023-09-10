document.addEventListener("DOMContentLoaded", function () {
	const gridSize = 9;
	const solveButton = document.getElementById("solve-btn");
	solveButton.addEventListener("click", solveSudoku);

	const resetButton = document.getElementById("reset-btn");
	resetButton.addEventListener("click", resetPuzzle);

	const sodokuGrid = document.getElementById("sudoku-grid");
	for (let row = 0; row < gridSize; row++) {
		const newRow = document.createElement("tr");
		for (let col = 0; col < gridSize; col++) {
			const cell = document.createElement("td");
			const input = document.createElement("input");
			input.type = "number";
			input.className = "cell";
			input.id = `cell-${row}-${col}`;
			cell.appendChild(input);
			newRow.appendChild(cell);
		}
		sodokuGrid.appendChild(newRow);
	}
});

async function solveSudoku() {
	const gridSize = 9;
	const sudokuArray = [];

	// Fill the sudokuArray with input values from the grid
	for (let row = 0; row < gridSize; row++) {
		sudokuArray[row] = [];
		for (let col = 0; col < gridSize; col++) {
			const cellId = `cell-${row}-${col}`;
			const cellValue = document.getElementById(cellId).value;
			sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
		}
	}

	// Identify user input
	for (let row = 0; row < gridSize; row++) {
		for (let col = 0; col < gridSize; col++) {
			const cellId = `cell-${row}-${col}`;
			const cell = document.getElementById(cellId);

			if (sudokuArray[row][col] !== 0) {
				cell.classList.add("user-input");
			}
		}
	}

	// Solve the remaining puzzle
	if (solveSudokuHelper(sudokuArray)) {
		for (let row = 0; row < gridSize; row++) {
			for (let col = 0; col < gridSize; col++) {
				const cellId = `cell-${row}-${col}`;
				const cell = document.getElementById(cellId);

				if (!cell.classList.contains("user-input")) {
					cell.value = sudokuArray[row][col];
					cell.classList.add("solved");
					await sleep(20);
				}
			}
		}
	} else {
		alert("No solution exists for the given Sudoku puzzle");
	}
}

function solveSudokuHelper(board) {
	const gridSize = 9;
	for (let row = 0; row < gridSize; row++) {
		for (let col = 0; col < gridSize; col++) {
			if (board[row][col] === 0) {
				for (let num = 1; num <= 9; num++) {
					if (isValidMove(board, row, col, num)) {
						board[row][col] = num;

						// Recursively attempt to solve
						if (solveSudokuHelper(board)) {
							return true; // Puzzle solved
						}

						board[row][col] = 0; // Backtrack
					}
				}

				return false; // No valid solution
			}
		}
	}

	return true;
}

function isValidMove(board, row, col, num) {
	const gridSize = 9;

	// Check columns for conflicts
	for (let i = 0; i < gridSize; i++) {
		if (board[row][i] === num || board[i][col] === num) {
			return false;
		}
	}

	// Check 3x3 subgrid for conflicts
	const startRow = Math.floor(row / 3) * 3;
	const startCol = Math.floor(col / 3) * 3;

	for (let i = startRow; i < startRow + 3; i++) {
		for (let j = startCol; j < startCol + 3; j++) {
			if (board[i][j] === num) {
				return false;
			}
		}
	}

	return true;
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function resetPuzzle() {
	const gridSize = 9;
	for (let row = 0; row < gridSize; row++) {
		for (let col = 0; col < gridSize; col++) {
			const cellId = `cell-${row}-${col}`;
			const cell = document.getElementById(cellId);
			cell.value = "";
			cell.classList.remove("solved");
		}
	}
}
